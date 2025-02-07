'use client'

import InputUploadFile from '@/components/InputUploadFile'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCanvas } from './hooks/useCanvas'

export interface Point {
  point: [number, number]
  label: number
}

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export default function EraserPage() {
  const { t } = useTranslation('eraser-page')
  const [uploadFile, setUploadFile] = useState<File>()
  const buttonUploadRef = useRef<HTMLInputElement>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(document.createElement('canvas'))
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)

  const [points, setPoints] = useState<Point[]>([])
  const [boxes, setBoxes] = useState<Box[]>([])
  const [actions, setActions] = useState<any[]>([])

  const {
    boxSelectionMode,
    drawingMode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    redrawCanvas,
    setBoxSelectionMode,
    setDrawingMode,
  } = useCanvas(
    canvasRef,
    maskCanvasRef,
    points,
    boxes,
    originalImage,
    setPoints,
    setBoxes,
    setActions
  )

  // const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files?.[0]
  //   if (!file) return

  //   const formData = new FormData()
  //   formData.append('image', file)

  //   fetch('/load_image', {
  //     method: 'POST',
  //     body: formData,
  //   })
  //     .then(response => response.json())
  //     .then(data => {
  //       if (data.image_data) {
  //         const img = new Image()
  //         img.src = 'data:image/png;base64,' + data.image_data
  //         img.onload = () => setOriginalImage(img)
  //       } else {
  //         alert('Error: ' + data.message)
  //       }
  //     })
  //     .catch(error => console.error('Error:', error))
  // }

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

  const sendPointsToServer = () => {
    const inputPoints = points.map(p => [p.point[0], p.point[1]])
    const inputLabels = points.map(p => p.label)

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
    const maskDataURL = maskCanvasRef.current.toDataURL('image/png')

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
    drawBox(box)

    const maskDataURL = maskCanvasRef.current.toDataURL('image/png')

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
    if (!originalImage || !canvasRef.current) {
      console.warn('Overlay ignored: No image loaded.')
      return
    }

    const overlayImage = new Image()
    overlayImage.src = 'data:image/png;base64,' + encodedOverlay

    overlayImage.onload = () => {
      const context = canvasRef.current?.getContext('2d')
      if (context && canvasRef.current) {
        context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        context.drawImage(originalImage, 0, 0)
        context.drawImage(maskCanvasRef.current, 0, 0)
        context.drawImage(overlayImage, 0, 0)
      }
    }
  }

  const handleProcessImage = () => {
    if (!originalImage) {
      alert('Please upload and segment an image first.')
      return
    }

    if (!canvasRef.current || !originalImage) return

    const canvasWidth = canvasRef.current.width
    const canvasHeight = canvasRef.current.height
    const originalWidth = originalImage.width
    const originalHeight = originalImage.height

    // Convert all points to original coordinates
    const convertedPoints = points.map(point => {
      const originalCoord = convertCanvasToOriginalCoordinates(
        { x: point.point[0], y: point.point[1] },
        canvasWidth,
        canvasHeight,
        originalWidth,
        originalHeight
      )
      return { x: originalCoord.x, y: originalCoord.y }
    })
    const convertedBoxes = boxes.map(box =>
      convertBoxToOriginalCoordinates(box, canvasWidth, canvasHeight, originalWidth, originalHeight)
    )
    console.log(convertedBoxes)
    // const inputPoints = convertedPoints.map(p => p.point)
    console.log(convertedPoints)
    // fetch('/process_image', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.erased_image) {
    //       setProcessedImage('data:image/png;base64,' + data.erased_image)
    //     } else {
    //       alert('Error: ' + data.error)
    //     }
    //   })
    //   .catch(error => console.error('Error:', error))
  }

  const handleUndo = () => {
    if (actions.length > 0) {
      // Undo the last action in the actions array
      const lastAction = actions.pop()
      if (lastAction.type === 'point') {
        setPoints(prevPoints => prevPoints.slice(0, -1)) // Remove the last point
      } else if (lastAction.type === 'box') {
        setBoxes(prevBoxes => prevBoxes.slice(0, -1)) // Remove the last box
      }
    } else if (points.length > 0) {
      // If no actions but points exist, remove the last point
      setPoints(prevPoints => prevPoints.slice(0, -1))
    } else if (boxes.length > 0) {
      // If no actions or points but boxes exist, remove the last box
      setBoxes(prevBoxes => prevBoxes.slice(0, -1))
    }

    redrawCanvas()

    // fetch('/undo', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    // })
    //   .then(response => response.json())
    //   .then(data => {
    //     if (data.mask_overlay) {
    //       const lastAction = actions.pop()
    //       if (lastAction?.type === 'point') {
    //         setPoints(prevPoints => prevPoints.slice(0, -1))
    //       } else if (lastAction?.type === 'box') {
    //         const undoneBox = boxes.pop()
    //         if (undoneBox && maskContext) {
    //           maskContext.clearRect(undoneBox.x, undoneBox.y, undoneBox.width, undoneBox.height)
    //         }
    //       }
    //       updateCanvasWithOverlay(data.mask_overlay)
    //     } else {
    //       alert('Error: ' + data.error)
    //     }
    //   })
    //   .catch(error => console.error('Error:', error))
  }

  const handleReset = () => {
    if (!originalImage) {
      alert('Application is already in the initial state.')
      return
    }

    if (
      window.confirm('Are you sure you want to reset the application? All actions will be lost.')
    ) {
      // fetch('/reset', { method: 'POST' })
      //   .then(response => response.json())
      //   .then(data => {
      //     if (data.success) {
      //       setOriginalImage(null)
      //       setPoints([])
      //       setBoxes([])
      //       setActions([])
      //       setProcessedImage('')
      //       alert('Application has been reset.')
      //     } else {
      //       alert('Error: ' + data.error)
      //     }
      //   })
      //   .catch(error => {
      //     console.error('Error:', error)
      //     alert('An error occurred while resetting the application.')
      //   })
    }
  }

  const handleChooseFile = useCallback(async (chooseFile: FileList | null) => {
    const file = chooseFile?.[0]
    if (file) {
      const fileBase64 = await convertToBase64(file)
      setUploadFile(file)
      // loadImage(fileBase64)
      const img = new Image()
      img.src = fileBase64
      img.onload = () => setOriginalImage(img)
    }
  }, [])

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file)

      fileReader.onload = () => {
        resolve(fileReader.result as string)
      }

      fileReader.onerror = error => {
        reject(error)
      }
    })
  }

  useEffect(() => {
    redrawCanvas()
  }, [points, boxes, redrawCanvas])

  return (
    <Box display={'flex'} flexDirection={'column'} padding={1} flex={1}>
      <Box display={'flex'} flexDirection={'row'} gap={2}>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <InputUploadFile onChoose={files => handleChooseFile(files)} ref={buttonUploadRef} />
          <Typography alignContent={'center'}>
            {uploadFile ? uploadFile.name : t('imagePlaceholder')}
          </Typography>
        </Box>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <Button variant='contained' onClick={handleProcessImage}>
            Process
          </Button>
          <Button variant='contained'>Print</Button>
          <Button variant='contained' onClick={handleUndo} disabled={!(actions.length > 0)}>
            Undo
          </Button>
          <Button variant='contained' onClick={handleReset}>
            Rest
          </Button>
          <Button
            variant='contained'
            onClick={() => setDrawingMode(!drawingMode)}
            disabled={boxSelectionMode}
          >
            {drawingMode ? 'Stop Drawing' : 'Drawing'}
          </Button>
          <Button
            variant='contained'
            onClick={() => setBoxSelectionMode(!boxSelectionMode)}
            disabled={drawingMode}
          >
            {boxSelectionMode ? 'Stop Drawing Box' : 'Draw Box'}
          </Button>
        </Box>
      </Box>
      <Box display={'flex'} flex={1} flexDirection={'column'} width={1080}>
        {/* <div className='canvas-container'> */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          style={{ cursor: 'crosshair' }}
          height={720}
          width={1080}
        />
        {/* <canvas ref={maskCanvasRef} style={{ display: 'none' }} /> */}
        {/* </div> */}
      </Box>
    </Box>
  )
}
