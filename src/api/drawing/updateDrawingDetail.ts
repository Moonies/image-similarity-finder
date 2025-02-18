import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export type UpdateDrawingImageDetail = {
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

export default async function updateDrawingDetail(
  httpRequest: HttpRequest,
  data: UpdateDrawingImageDetail
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.patch(`/api/drawings/${data.id}`, {
      ...data,
    })
  )

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: null,
  }
}
