import { ApiResponse, fetchInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'

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

export default async function getDrawingList(
  httpRequest: HttpRequest,
  drawingNumber: string
): Promise<ApiResponse<DrawingImageDetail[]>> {
  const response = await httpRequest(() =>
    fetchInstance(`/api/drawings`, {
      method: 'GET',
    })
  )

  if (!response.ok) {
    return {
      code: response.status,
      message: response.statusText,
      data: undefined,
    }
  }
  const result = await response.json()
  //result._embedded.drawings[0] _embedded for test need to discuss
  return { code: 200, message: 'success', data: result._embedded }
}
