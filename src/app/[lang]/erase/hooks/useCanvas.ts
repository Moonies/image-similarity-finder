import { useState, useCallback } from 'react'
import { Box, Point } from '../page'
import useEraser from './useErase'
import { useLoading } from '@/hooks/useLoading'
import { PredictData } from '@/api/eraser/addPredictDrawing'
import { useNotification } from '@/hooks/useNotification'

export const useCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  maskCanvasRef: React.RefObject<HTMLCanvasElement>,
  points: Point[],
  boxes: Box[],
  originalImage: HTMLImageElement | null,
  setPoints: React.Dispatch<React.SetStateAction<Point[]>>,
  setBoxes: React.Dispatch<React.SetStateAction<Box[]>>,
  setActions: React.Dispatch<React.SetStateAction<number>>,
  setOriginalImage: React.Dispatch<React.SetStateAction<HTMLImageElement | null>>
) => {
  const [isDrawing, setIsDrawing] = useState(false)
  const [isBoxDrawing, setIsBoxDrawing] = useState(false)
  const [drawingMode, setDrawingMode] = useState(false)
  const [boxSelectionMode, setBoxSelectionMode] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  // const [isOverlayActive, setIsOverlayActive] = useState(false)
  const [drawnCoordinates, setDrawnCoordinates] = useState<{ x: number; y: number }[]>([])
  const { convertDrawnCoordinatesToOriginal, updateEraseDrawing, addPredictDrawing } = useEraser()
  const { setLoading } = useLoading()
  const { notificationModal } = useNotification()

  // Get mouse position relative to the canvas
  const getMousePosition = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const rect = canvasRef.current.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return { x, y }
  }

  // Draw a point
  const drawPoint = useCallback(
    (x: number, y: number, label: number) => {
      const context = canvasRef.current?.getContext('2d')
      const maskContext = maskCanvasRef.current?.getContext('2d')
      if (!context || !maskContext) return

      context.beginPath()
      context.arc(x, y, 5, 0, 2 * Math.PI)
      context.fillStyle = label === 1 ? 'green' : 'red'
      context.fill()
      context.strokeStyle = 'white'
      context.lineWidth = 2
      context.stroke()

      maskContext.beginPath()
      maskContext.arc(x, y, 5, 0, 2 * Math.PI)
      maskContext.fillStyle = label === 1 ? 'green' : 'red'
      maskContext.fill()
      maskContext.strokeStyle = 'white'
      maskContext.lineWidth = 2
      maskContext.stroke()
    },
    [canvasRef, maskCanvasRef]
  )

  // Draw boxes
  const drawBoxes = useCallback(
    (boxList: Box[]) => {
      const context = canvasRef.current?.getContext('2d')
      const maskContext = maskCanvasRef.current?.getContext('2d')

      if (!context || !maskContext) return

      boxList.forEach(box => {
        context.fillStyle = 'rgba(0, 0, 255, 0.3)'
        context.strokeStyle = 'green'
        context.lineWidth = 2
        context.fillRect(box.x, box.y, box.width, box.height)
        context.strokeRect(box.x, box.y, box.width, box.height)
      })

      boxList.forEach(box => {
        maskContext.fillStyle = 'rgba(0, 0, 255, 0.3)'
        maskContext.strokeStyle = 'green'
        maskContext.lineWidth = 2
        maskContext.fillRect(box.x, box.y, box.width, box.height)
        maskContext.strokeRect(box.x, box.y, box.width, box.height)
      })
    },
    [canvasRef, maskCanvasRef]
  )

  // Redraw the canvas
  const redrawCanvas = useCallback(
    (boxList = boxes) => {
      if (!originalImage || !canvasRef.current || !maskCanvasRef.current) return

      const context = canvasRef.current.getContext('2d')
      const maskContext = maskCanvasRef.current?.getContext('2d')

      if (!context || !maskContext) return

      // Clear the canvas
      context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      maskContext.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

      // Draw the base image
      // context.drawImage(originalImage, 0, 0)

      // Get original image dimensions
      const imgWidth = originalImage.width
      const imgHeight = originalImage.height

      // Calculate aspect ratios
      const imgAspectRatio = imgWidth / imgHeight
      const canvasAspectRatio = canvasRef.current.width / canvasRef.current.height

      let drawWidth, drawHeight, offsetX, offsetY

      // Fit image to canvas while maintaining aspect ratio
      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider than canvas
        drawWidth = canvasRef.current.width
        drawHeight = canvasRef.current.width / imgAspectRatio
        offsetX = 0
        offsetY = (canvasRef.current.height - drawHeight) / 2 // Center vertically
      } else {
        // Image is taller than canvas
        drawWidth = canvasRef.current.height * imgAspectRatio
        drawHeight = canvasRef.current.height
        offsetX = (canvasRef.current.width - drawWidth) / 2 // Center horizontally
        offsetY = 0
      }

      // Draw the resized image
      context.drawImage(originalImage, offsetX, offsetY, drawWidth, drawHeight)

      // Draw the grey overlay (unmasked areas)
      // Apply grey overlay
      // if (isOverlayActive) {
      //   context.globalAlpha = 0.5 // Set transparency for the overlay
      //   context.fillStyle = 'grey'
      //   context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
      //   context.globalAlpha = 1.0 // Reset transparency}
      // }

      // Draw all points
      points.forEach(point => {
        drawPoint(point.point[0], point.point[1], point.label)
      })

      // Draw all boxes
      drawBoxes(boxList)
    },
    [boxes, canvasRef, drawBoxes, drawPoint, maskCanvasRef, originalImage, points]
  )
  // Handle mouse down
  const handleMouseDown = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalImage || !canvasRef.current) {
      notificationModal.warning('Please upload an image first.')
      return
    }
    const { x, y } = getMousePosition(event)

    if (drawingMode) {
      setIsDrawing(true)
      const context = canvasRef.current.getContext('2d')
      const maskContext = maskCanvasRef.current?.getContext('2d')
      if (context && maskContext) {
        context.beginPath()
        context.moveTo(x, y)
        maskContext.beginPath()
        maskContext.moveTo(x, y)
      }
    } else if (boxSelectionMode) {
      setIsBoxDrawing(true)
      setStartX(x)
      setStartY(y)
      // setIsOverlayActive(true)
    } else if (!drawingMode && !boxSelectionMode) {
      setLoading(true)
      const label = event.button === 0 ? 1 : 0 // Left-click: foreground, Right-click: background
      setPoints(prevPoints => [...prevPoints, { point: [x, y], label }])
      // setActions(prevActions => [...prevActions, { type: 'point', data: { point: [x, y], label } }])
      setActions(prevActions => prevActions + 1)
      drawPoint(x, y, label)
      // setIsOverlayActive(true)
      // sendPointsToServer(maskCanvasRef)
      const predictData: PredictData = {
        x: x,
        y: y,
        label: label,
      }
      const result = await addPredictDrawing(predictData)
      if (result.code === 200 && result.data) {
        const img = new Image()
        img.src = result.data
        img.onload = () => setOriginalImage(img)
        setTimeout(() => {
          setPoints([])
          redrawCanvas()
          setLoading(false)
        }, 1000)
      }
    }
  }

  // Handle mouse move
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalImage || !canvasRef.current) return
    const { x, y } = getMousePosition(event)

    const context = canvasRef.current.getContext('2d')
    const maskContext = maskCanvasRef.current?.getContext('2d')
    if (!context) return

    if (drawingMode && isDrawing) {
      if (context && maskContext) {
        // redrawCanvas()

        context.lineTo(x, y)
        context.strokeStyle = 'rgba(255, 0, 0, 0.5)'
        context.lineWidth = 5
        context.stroke()

        maskContext.lineTo(x, y)
        maskContext.strokeStyle = 'rgb(0, 0, 0)'
        maskContext.lineWidth = 5
        maskContext.stroke()
      }
      // Add the current coordinates to the drawnCoordinates list
      setDrawnCoordinates(prevCoordinates => [...prevCoordinates, { x, y }])
    } else if (boxSelectionMode && isBoxDrawing) {
      if (!maskContext) return
      redrawCanvas()
      // Clear and redraw all layers (image, mask, points, boxes)

      // Draw the currently dragged box
      const width = x - startX
      const height = y - startY
      context.fillStyle = 'rgba(0, 0, 255, 0.3)'
      context.strokeStyle = 'green'
      context.lineWidth = 2
      context.strokeRect(startX, startY, width, height)

      maskContext.fillStyle = 'rgba(0, 0, 255, 0.3)'
      maskContext.strokeStyle = 'green'
      maskContext.lineWidth = 2
      maskContext.strokeRect(startX, startY, width, height)
    }
  }

  // Handle mouse up
  const handleMouseUp = async (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!originalImage || !canvasRef.current) return
    const { x, y } = getMousePosition(event)

    if (isDrawing) {
      setLoading(true)
      setIsDrawing(false)
      // redrawCanvas()
      const canvasWidth = canvasRef.current.width
      const canvasHeight = canvasRef.current.height
      const originalWidth = originalImage.width
      const originalHeight = originalImage.height

      const _result = convertDrawnCoordinatesToOriginal(
        drawnCoordinates,
        canvasWidth,
        canvasHeight,
        originalWidth,
        originalHeight
      )
      // console.log('Drawn Coordinates:', result)

      const response = await updateEraseDrawing(maskCanvasRef)
      if (!response) return
      if (response.code === 200 && response.data) {
        const img = new Image()
        img.src = response.data
        img.onload = () => setOriginalImage(img)
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
      setActions(prevActions => prevActions + 1)
      // Optionally, clear the coordinates after processing
      setDrawnCoordinates([])
    } else if (isBoxDrawing) {
      setLoading(true)
      // Save the box to the state
      const box = {
        x: Math.min(startX, x),
        y: Math.min(startY, y),
        width: Math.abs(x - startX),
        height: Math.abs(y - startY),
      }
      const updatedBoxes = [...boxes, box]

      setBoxes(updatedBoxes)
      // setActions(prevActions => [...prevActions, { type: 'box', data: box }])
      setActions(prevActions => prevActions + 1)

      redrawCanvas(updatedBoxes)
      // Stop box drawing
      setIsBoxDrawing(false)

      // sendBoxToServer(maskCanvasRef)
      const response = await updateEraseDrawing(maskCanvasRef)
      if (!response) return
      if (response.code === 200 && response.data) {
        const img = new Image()
        img.src = response.data
        img.onload = () => setOriginalImage(img)
        setBoxes([])
        redrawCanvas()
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      }
    }
  }

  return {
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    redrawCanvas,
    drawingMode,
    setDrawingMode,
    boxSelectionMode,
    setBoxSelectionMode,
  }
}
