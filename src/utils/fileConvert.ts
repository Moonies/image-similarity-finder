import Tiff from 'tiff.js'
import * as pdfjsLib from 'pdfjs-dist'
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js'

export const convertTifToBlob = async (blobFile: Blob | File) => {
  const arrayBuffer = await blobFile.arrayBuffer()

  try {
    // Use tiff.js to process the TIFF file
    const tiff = new Tiff({ buffer: arrayBuffer })
    const canvas = tiff.toCanvas() // Convert TIFF to a canvas

    // Convert the canvas to a data URL (PNG format)
    const blob = await new Promise<Blob | null>(resolve =>
      canvas.toBlob(blob => resolve(blob), 'image/png')
    )
    tiff.close()
    return blob

    // Clean up resources
  } catch (error) {
    console.error('Error decoding TIFF file:', error)
  }
}

export const convertPdfToBlob = async (pdfFile: Blob | File) => {
  if (!pdfFile) return
  const pdfBlobUrl = URL.createObjectURL(pdfFile)
  // Load the PDF using pdf.js
  const pdf = await pdfjsLib.getDocument(pdfBlobUrl).promise
  // const pdf = await pdfjsLib.PDFWorker.workerSrc.getDocument(pdfBlobUrl).promise

  // Get the first page of the PDF
  const page = await pdf.getPage(1)

  // Create a viewport for the page (adjust scale as needed)
  const viewport = page.getViewport({ scale: 1 })

  // Create a hidden canvas
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')!
  canvas.width = viewport.width
  canvas.height = viewport.height

  // Render the PDF page into the canvas
  await page.render({ canvasContext: context, viewport }).promise

  // Convert the canvas content to a data URL (image)
  const imageDataUrl = canvas.toDataURL('image/png')

  // Clean up the canvas
  canvas.remove()

  return imageDataUrl
}

export const extractTextFromPDF = async (file: string): Promise<string> => {
  const pdf = await pdfjsLib.getDocument({
    url: file, // Your PDF file's URL
    cMapUrl: '/cmaps/', // Path to your CMaps folder
    cMapPacked: true,
  }).promise
  let extractedText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    console.log(textContent)
    // Extract text while preserving spaces and line breaks
    const pageText = textContent.items
      .map(item => (item as any).str) // Extract the text of each item
      .join(' ') // Join with spaces to preserve formatting

    extractedText += pageText + '\n' // Add a line break after each page
  }
  return extractedText.trim() // Return the cleaned-up text
}

// Process text based on the file's structure
export const processPDFText = (text: string): string => {
  const lines = text.split('\n') // Split the text into lines
  let html = ''
  let currentList = '' // Tracks whether we are in a list (e.g., `<ul>`)

  lines.forEach(line => {
    const trimmedLine = line.trim()
    console.log(trimmedLine)
    if (trimmedLine.startsWith('Change') || trimmedLine.startsWith('変更ログ')) {
      // Add the main title
      html += `<h2 style="font-size: 32px;">${trimmedLine}</h2>\n`
    } else if (trimmedLine.startsWith('Bug Issues') || trimmedLine.startsWith('バグの問題')) {
      // Start Bug Issues section
      if (currentList) {
        html += `</ul>\n` // Close the previous list if any
      }
      html += `<h2 style="font-size: 32px;">${trimmedLine}</h2>\n<ul>\n`
      currentList = 'ul'
    } else if (trimmedLine.startsWith('Features') || trimmedLine.startsWith('機能')) {
      // Start Features section
      if (currentList) {
        html += `</ul>\n` // Close the previous list if any
      }
      html += `<h2 style="font-size: 32px;">${trimmedLine}</h2>\n<ul>\n`
      currentList = 'ul'
    } else if (trimmedLine.startsWith('-')) {
      // Regular list items
      html += `<li style="font-size: 22px;">${trimmedLine.replace('-', '').trim()}</li>\n`
    } else if (trimmedLine.startsWith('•')) {
      // Nested list items
      html += `<li style="margin-left: 20px;font-size: 22px;">${trimmedLine
        .replace('•', '')
        .trim()}</li>\n`
    } else if (trimmedLine) {
      // Handle lines that are not prefixed with '-' or '•' (e.g., "Remove xxxxxx")
      html += `<li style="font-size: 22px;">${trimmedLine}</li>\n`
    }
  })

  // Close any open lists
  if (currentList) {
    html += `</ul>`
  }

  return html
}

export const reformatText = (text: string): string => {
  // Normalize spaces and line breaks
  text = text.replace(/\r\n|\r/g, '\n') // Normalize line breaks
  text = text.replace(/\s+/g, ' ') // Replace multiple spaces with a single space

  // Dynamically detect section headings and ensure they are on a new line
  const sectionHeadings = ['Change Log', 'Bug Issues', 'Features', '変更ログ', 'バグの問題', '機能'] // Add more headings if needed
  sectionHeadings.forEach(heading => {
    const regex = new RegExp(`(.*)(${heading})`, 'i') // Match any text before the heading
    text = text.replace(regex, '$1\n$2') // Insert a line break before the heading
  })

  // Insert line breaks before list items and nested items
  text = text.replace(/(\s+-)/g, '\n$1') // Regular list items
  text = text.replace(/(\s+•)/g, '\n$1') // Nested list items

  return text.trim() // Remove any extra spaces or newlines
}
