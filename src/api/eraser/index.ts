import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as addEraserDrawingImage, EraserDrawingDetail } from './addEraserDrawingImage'
import { default as updateEraserDrawing } from './updateEraserDrawing'
import { default as undoEraserDrawing } from './undoEraserDrawing'
import { default as processEraserDrawing } from './processEraserDrawing'
import { default as resetEraserDrawingImage } from './resetEraserDrawingImage'
import { default as addPredictDrawing, PredictData } from './addPredictDrawing'
import { default as updateEraserDrawingImage } from './updateEraserDrawingImage'
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
  updateEraserDrawingImage: (file: File) => Promise<ApiResponse<null>>
}

export default function search(httpRequest: HttpRequest): EraserApi {
  return {
    addEraserDrawingImage: (file, predictorId) =>
      addEraserDrawingImage(httpRequest, file, predictorId),
    updateEraserDrawing: (newEraser, predictorId) =>
      updateEraserDrawing(httpRequest, newEraser, predictorId),
    undoEraserDrawing: predictorId => undoEraserDrawing(httpRequest, predictorId),
    processEraserDrawing: predictorId => processEraserDrawing(httpRequest, predictorId),
    resetEraserDrawingImage: predictorId => resetEraserDrawingImage(httpRequest, predictorId),
    addPredictDrawing: (params, predictorId) => addPredictDrawing(httpRequest, params, predictorId),
    updateEraserDrawingImage: file => updateEraserDrawingImage(httpRequest, file),
  }
}
