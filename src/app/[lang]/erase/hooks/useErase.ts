import useHttp from '@/hooks/useHttp'
import { Box } from '../page'
import { v4 as uuidv4 } from 'uuid'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setPredictorId, setFileName } from '@/store/slices/eraseSlice'
import { useNotification } from '@/hooks/useNotification'
import { PredictData } from '@/api/eraser/addPredictDrawing'

export default function useEraser() {
  const { api } = useHttp()
  const dispatch = useAppDispatch()
  const { predictorId } = useAppSelector(state => state.erase)
  const { notificationSnackbar } = useNotification()

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

  const sendPointsToServer = (maskCanvasRef: any) => {
    if (!maskCanvasRef) return
    const maskDataURL = maskCanvasRef.current.toDataURL('image/png')

    console.log(maskDataURL)
    console.log(predictorId)
  }

  const sendDrawnMaskToServer = async (maskCanvasRef: any) => {
    if (!maskCanvasRef) return
    const maskDataURL = maskCanvasRef.current.toDataURL('image/png')
    const maskDataBase64 = maskDataURL.split(',')[1]
    // console.log(maskDataURL)
    const result = await api.eraser.updateEraserDrawing(maskDataBase64, predictorId)
    console.log(result)
    return result
    // if(result.code===)
  }

  const updateEraseDrawing = async (maskCanvasRef: React.RefObject<HTMLCanvasElement>) => {
    // setLoading(true)
    if (!maskCanvasRef.current) return
    const maskDataURL = maskCanvasRef.current.toDataURL('image/png')
    console.log(maskDataURL)
    const maskDataBase64 = maskDataURL.split(',')[1]
    const result = await api.eraser.updateEraserDrawing(maskDataBase64, predictorId)
    // console.log(result)
    return result
  }

  const addEraseDrawing = async (drawingImage: File) => {
    const id = uuidv4()
    const result = await api.eraser.addEraserDrawingImage(drawingImage, id)
    if (result.code === 200 && result.data) {
      dispatch(setPredictorId({ predictorId: id }))
      dispatch(setFileName({ fileName: drawingImage.name }))
      return result.data
    }
  }

  const undoEraserDrawing = async () => {
    const result = await api.eraser.undoEraserDrawing(predictorId)
    if (result.code === 200 && result.data) {
      return result.data
    }
  }

  const processEraserDrawing = async () => {
    const result = await api.eraser.processEraserDrawing(predictorId)
    if (result.code === 200 && result.data) {
      // dispatch(setFileDetail({ file: result.data }))
      // return URL.createObjectURL(result.data)
      return result.data
    }
  }

  const resetEraserDrawing = async () => {
    const result = await api.eraser.resetEraserDrawingImage(predictorId)
    if (result.code === 200) {
      notificationSnackbar.success('remove success!!')
      return true
    }
  }

  const addPredictDrawing = async (predictData: PredictData) => {
    const result = await api.eraser.addPredictDrawing(predictData, predictorId)
    return result
  }

  const updateEraserDrawingImage = async (currentProceesedFile: File) => {
    const result = await api.eraser.updateEraserDrawingImage(currentProceesedFile)
    if (result.code === 200) {
    }
  }

  const addNewDrawing = async () => {}

  return {
    sendPointsToServer,
    sendDrawnMaskToServer,
    convertCanvasToOriginalCoordinates,
    convertBoxToOriginalCoordinates,
    convertDrawnCoordinatesToOriginal,
    addEraseDrawing,
    undoEraserDrawing,
    updateEraseDrawing,
    processEraserDrawing,
    resetEraserDrawing,
    addPredictDrawing,
    updateEraserDrawingImage,
  }
}
