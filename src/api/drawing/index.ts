import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as searchDrawing } from './searchDrawing'
import { default as getDrawingDetail, DrawingImageDetail } from './getDrawingDetail'
import { default as updateDrawingDetail, UpdateDrawingImageDetail } from './updateDrawingDetail'

export interface SearchApi {
  searchDrawing: (file: File) => Promise<ApiResponse<Blob | undefined>>
  getDrawingDetail: (drawingNumber: string) => Promise<ApiResponse<DrawingImageDetail>>
  updateDrawingDetail: (params: UpdateDrawingImageDetail) => Promise<ApiResponse<{}>>
}

export default function search(httpRequest: HttpRequest): SearchApi {
  return {
    searchDrawing: file => searchDrawing(httpRequest, file),
    getDrawingDetail: drawingNumber => getDrawingDetail(httpRequest, drawingNumber),
    updateDrawingDetail: params => updateDrawingDetail(httpRequest, params),
  }
}
