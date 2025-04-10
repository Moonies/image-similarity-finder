import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as addEraserDrawingImage, EraserDrawingDetail } from './addEraserDrawingImage'
import { default as updateEraserDrawing } from './updateEraserDrawing'
import { default as undoEraserDrawing } from './undoEraserDrawing'
import { default as processEraserDrawing } from './processEraserDrawing'
import { default as resetEraserDrawingImage } from './resetEraserDrawingImage'
import { default as addPredictDrawing, PredictData } from './addPredictDrawing'
import { default as updateEraserDrawingImage } from './updateEraserDrawingImage'
import { default as getLatestEraserDrawingImage } from './getLatestEraserDrawingImage'
import { default as getLatestEraserDrawing } from './getLatestEraserDrawing'
export interface EraserApi {
  addEraserDrawingImage: (
    file: File,
    predictorId: string
  ) => Promise<ApiResponse<EraserDrawingDetail>>
  updateEraserDrawing: (newEraser: string, predictorId: string) => Promise<ApiResponse<string>>
  undoEraserDrawing: (predictorId: string) => Promise<ApiResponse<string>>
  processEraserDrawing: (predictorId: string) => Promise<ApiResponse<File>>
  resetEraserDrawingImage: (predictorId: string) => Promise<ApiResponse<null>>
  addPredictDrawing: (params: PredictData, predictorId: string) => Promise<ApiResponse<string>>
  updateEraserDrawingImage: (predictorId: string) => Promise<ApiResponse<null>>
  getLatestEraserDrawingImage: (
    predictorId: string,
    disableDisplayError?: boolean
  ) => Promise<ApiResponse<string>>
  getLatestEraserDrawing: (
    predictorId: string,
    disableDisplayError?: boolean
  ) => Promise<ApiResponse<File>>
}

export default function eraser(httpRequest: HttpRequest): EraserApi {
  return {
    addEraserDrawingImage: (file, predictorId) =>
      addEraserDrawingImage(httpRequest, file, predictorId),
    updateEraserDrawing: (newEraser, predictorId) =>
      updateEraserDrawing(httpRequest, newEraser, predictorId),
    undoEraserDrawing: predictorId => undoEraserDrawing(httpRequest, predictorId),
    processEraserDrawing: predictorId => processEraserDrawing(httpRequest, predictorId),
    resetEraserDrawingImage: predictorId => resetEraserDrawingImage(httpRequest, predictorId),
    addPredictDrawing: (params, predictorId) => addPredictDrawing(httpRequest, params, predictorId),
    updateEraserDrawingImage: predictorId => updateEraserDrawingImage(httpRequest, predictorId),
    getLatestEraserDrawingImage: (predictorId, disableDisplayError) =>
      getLatestEraserDrawingImage(httpRequest, predictorId, disableDisplayError),
    getLatestEraserDrawing: (predictorId, disableDisplayError) =>
      getLatestEraserDrawing(httpRequest, predictorId, disableDisplayError),
  }
}
