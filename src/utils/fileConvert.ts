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
