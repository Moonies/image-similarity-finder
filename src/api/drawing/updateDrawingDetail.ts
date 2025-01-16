import { HttpRequest } from '@/hooks/useHttp'
import React from 'react'
import { ApiResponse, fetchInstance } from '@/api'

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
): Promise<ApiResponse<{}>> {
  const response = await httpRequest(() =>
    fetchInstance(`/api/drawings/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
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
  return { code: 200, message: 'success', data: null }
}
