import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as searchDrawing } from './searchDrawing'
import { default as getDrawingDetail, DrawingImageDetail } from './getDrawingDetail'
import { default as updateDrawingDetail, UpdateDrawingImageDetail } from './updateDrawingDetail'
import { default as getDrawingList } from './getDrawingList'

export interface SearchApi {
  searchDrawing: (file: File) => Promise<ApiResponse<Blob | undefined>>
  getDrawingDetail: (drawingNumber: string) => Promise<ApiResponse<DrawingImageDetail>>
  updateDrawingDetail: (params: UpdateDrawingImageDetail) => Promise<ApiResponse<null>>
  getDrawingList: () => Promise<ApiResponse<DrawingImageDetail[]>>
}

export default function search(httpRequest: HttpRequest): SearchApi {
  return {
    searchDrawing: file => searchDrawing(httpRequest, file),
    getDrawingDetail: drawingNumber => getDrawingDetail(httpRequest, drawingNumber),
    updateDrawingDetail: params => updateDrawingDetail(httpRequest, params),
    getDrawingList: () => getDrawingList(httpRequest, ''),
  }
}
