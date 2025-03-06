import UTIF from 'utif'

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
