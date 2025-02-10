import { Box } from '../page'

export default function useEraser() {
  const calculateScalingAndOffsets = (
    canvasWidth: number,
    canvasHeight: number,
    originalWidth: number,
    originalHeight: number
  ) => {
    const scale = canvasHeight / originalHeight
    const scaledImageWidth = originalWidth * scale
    const offsetX = (canvasWidth - scaledImageWidth) / 2
    const offsetY = 0 // No vertical padding

    return { scale, offsetX, offsetY }
  }

  const convertCanvasToOriginalCoordinates = (
    canvasCoord: { x: number; y: number },
    canvasWidth: number,
    canvasHeight: number,
    originalWidth: number,
    originalHeight: number
  ) => {
    const { scale, offsetX, offsetY } = calculateScalingAndOffsets(
      canvasWidth,
      canvasHeight,
      originalWidth,
      originalHeight
    )

    // Subtract the offset and divide by the scale factor
    const originalX = (canvasCoord.x - offsetX) / scale
    const originalY = (canvasCoord.y - offsetY) / scale

    return { x: originalX, y: originalY }
  }
  // Function to convert a single box to original coordinates
  const convertBoxToOriginalCoordinates = (
    box: Box,
    canvasWidth: number,
    canvasHeight: number,
    originalWidth: number,
    originalHeight: number
  ): Box => {
    const { scale, offsetX, offsetY } = calculateScalingAndOffsets(
      canvasWidth,
      canvasHeight,
      originalWidth,
      originalHeight
    )

    return {
      x: (box.x - offsetX) / scale,
      y: (box.y - offsetY) / scale,
      width: box.width / scale,
      height: box.height / scale,
    }
  }

  const convertDrawnCoordinatesToOriginal = (
    drawnCoordinates: { x: number; y: number }[],
    canvasWidth: number,
    canvasHeight: number,
    originalWidth: number,
    originalHeight: number
  ): { x: number; y: number }[] => {
    return drawnCoordinates.map(point =>
      convertCanvasToOriginalCoordinates(
        point,
        canvasWidth,
        canvasHeight,
        originalWidth,
        originalHeight
      )
    )
  }

  const sendPointsToServer = () => {
    // const inputPoints = points.map(p => [p.point[0], p.point[1]])
    // const inputLabels = points.map(p => p.label)
    // fetch('/predict', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ points: inputPoints, labels: inputLabels }),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.mask_overlay) {
    //       updateCanvasWithOverlay(data.mask_overlay)
    //     } else {
    //       alert('Error: ' + data.error)
    //     }
    //   })
    //   .catch(error => console.error('Error:', error))
  }

  const sendDrawnMaskToServer = () => {
    // const maskDataURL = maskCanvasRef.current.toDataURL('image/png')
    // fetch('/submit_mask', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ mask: maskDataURL }),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.success && data.mask_overlay) {
    //       updateCanvasWithOverlay(data.mask_overlay)
    //       setActions(prevActions => [...prevActions, { type: 'mask' }])
    //       maskContext?.clearRect(0, 0, maskCanvasRef.current.width, maskCanvasRef.current.height)
    //     } else {
    //       alert('Error: ' + data.error)
    //     }
    //   })
    //   .catch(error => console.error('Error:', error))
  }

  const sendBoxToServer = (box: { x: number; y: number; width: number; height: number }) => {
    // const maskDataURL = maskCanvasRef.current.toDataURL('image/png')
    // fetch('/submit_mask', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ mask: maskDataURL }),
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.success && data.mask_overlay) {
    //       updateCanvasWithOverlay(data.mask_overlay)
    //     } else {
    //       alert('Error: ' + data.error)
    //     }
    //   })
    //   .catch(error => console.error('Error:', error))
  }

  const updateCanvasWithOverlay = (encodedOverlay: string) => {
    // if (!originalImage || !canvasRef.current) {
    //   console.warn('Overlay ignored: No image loaded.')
    //   return
    // }
    // const overlayImage = new Image()
    // overlayImage.src = 'data:image/png;base64,' + encodedOverlay
    // overlayImage.onload = () => {
    //   const context = canvasRef.current?.getContext('2d')
    //   if (context && canvasRef.current) {
    //     context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    //     context.drawImage(originalImage, 0, 0)
    //     context.drawImage(maskCanvasRef.current, 0, 0)
    //     context.drawImage(overlayImage, 0, 0)
    //   }
    // }
  }
  return {
    sendPointsToServer,
    sendDrawnMaskToServer,
    sendBoxToServer,
    updateCanvasWithOverlay,
    convertCanvasToOriginalCoordinates,
    convertBoxToOriginalCoordinates,
    convertDrawnCoordinatesToOriginal,
  }
}
