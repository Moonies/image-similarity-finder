import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as searchDrawing } from './searchDrawing'
import { default as getDrawingDetail } from './getDrawingDetail'
import { default as updateDrawingDetail, UpdateDrawingImageDetail } from './updateDrawingDetail'
import { default as getDrawingList, DrawingListSearchCriteria } from './getDrawingList'
import { default as getDrawingImage } from './getDrawingImage'
import { default as removeDrawing } from './removeDrawing'
import { default as updateDrawingImage } from './updateDrawingImage'
import { default as addNewDrawingImage } from './addNewDrawingImage'
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
export interface DrawingApi {
  searchDrawing: (file: File) => Promise<ApiResponse<Blob | undefined>>
  getDrawingDetail: (drawingNumber: string) => Promise<ApiResponse<DrawingImageDetail>>
  updateDrawingDetail: (params: UpdateDrawingImageDetail) => Promise<ApiResponse<null>>
  getDrawingList: (params: DrawingListSearchCriteria) => Promise<ApiResponse<DrawingImageDetail[]>>
  getDrawingImage: (drawingId: string) => Promise<ApiResponse<string>>
  removeDrawing: (drawingId: string) => Promise<ApiResponse<null>>
  updateDrawingImage: (
    file: File,
    drawingId: string,
    disableDisplayError?: boolean
  ) => Promise<ApiResponse<null>>
  addNewDrawingImage: (file: File) => Promise<ApiResponse<null>>
}

export default function search(httpRequest: HttpRequest): DrawingApi {
  return {
    searchDrawing: file => searchDrawing(httpRequest, file),
    getDrawingDetail: drawingNumber => getDrawingDetail(httpRequest, drawingNumber),
    updateDrawingDetail: params => updateDrawingDetail(httpRequest, params),
    getDrawingList: params => getDrawingList(httpRequest, params),
    getDrawingImage: drawingId => getDrawingImage(httpRequest, drawingId),
    removeDrawing: drawingId => removeDrawing(httpRequest, drawingId),
    updateDrawingImage: (file, drawingId, disableDisplayError) =>
      updateDrawingImage(httpRequest, file, drawingId, disableDisplayError),
    addNewDrawingImage: file => addNewDrawingImage(httpRequest, file),
  }
}
