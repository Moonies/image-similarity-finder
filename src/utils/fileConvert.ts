import UTIF from 'utif'
import * as pdfjsLib from 'pdfjs-dist'
import fs from 'fs'
import path from 'path'
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.js'

export const convertTifToBlob = async (blobFile: Blob | File) => {
  const buffer = await blobFile.arrayBuffer()
  const ifds = UTIF.decode(buffer)
  UTIF.decodeImage(buffer, ifds[0])
  const rgba = UTIF.toRGBA8(ifds[0])

  const canvas = document.createElement('canvas')
  canvas.width = ifds[0].width
  canvas.height = ifds[0].height

  const ctx = canvas.getContext('2d')
  if (ctx) {
    const imgData = ctx.createImageData(canvas.width, canvas.height)
    imgData.data.set(rgba)
    ctx.putImageData(imgData, 0, 0)

    const pngBlob = await new Promise<Blob>(resolve => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob)
      }, 'image/png')
    })
    return pngBlob
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

export async function readFolder(folderName: string): Promise<string[]> {
  const folderPath = path.join(process.cwd(), folderName)

  try {
    return fs.readdirSync(folderPath) // Read files in the directory
  } catch (error) {
    console.error('Error reading folder:', error)
    return []
  }
}
