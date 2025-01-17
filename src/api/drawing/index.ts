import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as searchDrawing } from './searchDrawing'
import { default as getDrawingDetail } from './getDrawingDetail'
import { default as updateDrawingDetail, UpdateDrawingImageDetail } from './updateDrawingDetail'
import { default as getDrawingList, DrawingListSearchCriteria } from './getDrawingList'
import { default as getDrawingImage } from './getDrawingImage'

export type DrawingImageDetail = {
  id: string
  drawingNumber: string
  orderNumber: string
  name: string
  materialCost: number
  materialSup: string
  latheCost: number
  latheSup: string
  millingCost: number
  millingSup: string
  heatTreatmentCost: number
  heatTreatmentSup: string
  grindingCost: number
  grindingSup: string
  transportationCost: number
  transportationSup: string
  generalCost: number
  generalSup: string
  weldingCost: number
  weldingSup: string
  otherCost: number
  otherSup: string
  sellingPrice: number
  defectDetails: string
}
export interface SearchApi {
  searchDrawing: (file: File) => Promise<ApiResponse<Blob | undefined>>
  getDrawingDetail: (drawingNumber: string) => Promise<ApiResponse<DrawingImageDetail>>
  updateDrawingDetail: (params: UpdateDrawingImageDetail) => Promise<ApiResponse<null>>
  getDrawingList: (params: DrawingListSearchCriteria) => Promise<ApiResponse<DrawingImageDetail[]>>
  getDrawingImage: (drawingId: string) => Promise<ApiResponse<string>>
}

export default function search(httpRequest: HttpRequest): SearchApi {
  return {
    searchDrawing: file => searchDrawing(httpRequest, file),
    getDrawingDetail: drawingNumber => getDrawingDetail(httpRequest, drawingNumber),
    updateDrawingDetail: params => updateDrawingDetail(httpRequest, params),
    getDrawingList: params => getDrawingList(httpRequest, params),
    getDrawingImage: drawingId => getDrawingImage(httpRequest, drawingId),
  }
}
