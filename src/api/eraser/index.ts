import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as addEraserDrawingImage, EraserDrawingDetail } from './addEraserDrawingImage'
import { default as updateEraserDrawing } from './updateEraserDrawing'
import { default as undoEraserDrawing } from './undoEraserDrawing'
import { default as processEraserDrawing } from './processEraserDrawing'
export interface EraserApi {
  addEraserDrawingImage: (
    file: File,
    predictorId: string
  ) => Promise<ApiResponse<EraserDrawingDetail>>
  updateEraserDrawing: (newEraser: string, predictorId: string) => Promise<ApiResponse<string>>
  undoEraserDrawing: (predictorId: string) => Promise<ApiResponse<string>>
  processEraserDrawing: (predictorId: string) => Promise<ApiResponse<string>>
}

export default function search(httpRequest: HttpRequest): EraserApi {
  return {
    addEraserDrawingImage: (file, predictorId) =>
      addEraserDrawingImage(httpRequest, file, predictorId),
    updateEraserDrawing: (newEraser, predictorId) =>
      updateEraserDrawing(httpRequest, newEraser, predictorId),
    undoEraserDrawing: predictorId => undoEraserDrawing(httpRequest, predictorId),
    processEraserDrawing: predictorId => processEraserDrawing(httpRequest, predictorId),
  }
}
