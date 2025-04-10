import useHttp from '@/hooks/useHttp'
import { Box } from '../page'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setPredictorId, setFileName } from '@/store/slices/eraseSlice'
import { useNotification } from '@/hooks/useNotification'
import { PredictData } from '@/api/eraser/addPredictDrawing'
import { useTranslation } from 'react-i18next'

export default function useEraser() {
  const { api } = useHttp()
  const dispatch = useAppDispatch()
  const { predictorId } = useAppSelector(state => state.erase)
  const { notificationSnackbar } = useNotification()
  const { t } = useTranslation('erase-page')

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

  const sendDrawnMaskToServer = async (maskCanvasRef: any) => {
    if (!maskCanvasRef) return
    const maskDataURL = maskCanvasRef.current.toDataURL('image/png')
    const maskDataBase64 = maskDataURL.split(',')[1]
    // console.log(maskDataURL)
    const result = await api.eraser.updateEraserDrawing(maskDataBase64, predictorId)
    return result
  }

  const updateEraseDrawing = async (maskCanvasRef: React.RefObject<HTMLCanvasElement>) => {
    // setLoading(true)
    if (!maskCanvasRef.current) return
    const maskDataURL = maskCanvasRef.current.toDataURL('image/png')
    // console.log(maskDataURL)
    const maskDataBase64 = maskDataURL.split(',')[1]
    const result = await api.eraser.updateEraserDrawing(maskDataBase64, predictorId)
    return result
  }

  const saveNewFileDrawing = async () => {
    const response = await getLatestEraserDrawing(predictorId, true)
    if (response.code === 200 && response.data) {
      // console.log(response.data)
      const file = new File([response.data], predictorId, { type: response.data.type })
      const result = await addNewDrawing(file)
      if (result) {
        notificationSnackbar.success(t('notification.add.success'))
      }
    }
  }

  const addEraseDrawing = async (drawingImage: File) => {
    const result = await api.eraser.addEraserDrawingImage(drawingImage, drawingImage.name)
    if (result.code === 200 && result.data) {
      dispatch(setPredictorId({ predictorId: drawingImage.name }))
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
      notificationSnackbar.success(t('notification.reset.success'))
      return true
    }
  }

  const addPredictDrawing = async (predictData: PredictData) => {
    const result = await api.eraser.addPredictDrawing(predictData, predictorId)
    return result
  }

  const updateEraserDrawingImage = async (predictorId: string) => {
    const result = await api.eraser.updateEraserDrawingImage(predictorId)
    return result
  }

  const addNewDrawing = async (newDrawingFile: File) => {
    const result = await api.drawing.addNewDrawingImage(newDrawingFile)
    if (result.code === 200) {
      return true
    }
  }

  const checkExistDrawing = async (fileName: string) => {
    const result = await api.drawing.checkExistDrawing(fileName.split('.')[0])
    if (result.code === 200) {
      return true
    }
    return false
  }

  const getLatestEraserDrawingImage = async (
    predictorId: string,
    disableDisplayError?: boolean
  ) => {
    const result = await api.eraser.getLatestEraserDrawingImage(predictorId, disableDisplayError)
    return result
  }

  const getLatestEraserDrawing = async (predictorId: string, disableDisplayError?: boolean) => {
    const result = await api.eraser.getLatestEraserDrawing(predictorId, disableDisplayError)
    return result
  }

  return {
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
    addNewDrawing,
    checkExistDrawing,
    getLatestEraserDrawingImage,
    saveNewFileDrawing,
  }
}
