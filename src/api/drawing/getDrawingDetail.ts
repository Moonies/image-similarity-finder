import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { DrawingImageDetail } from '@/api/drawing'
import axios from 'axios'

export default async function getDrawingDetail(
  httpRequest: HttpRequest,
  drawingNumber: string
): Promise<ApiResponse<DrawingImageDetail>> {
  // fetchInstance(`/api/drawings?drawingNumber.equal=${drawingNumber}`, {
  //   method: 'GET',
  // })
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/drawings?drawingNumber.equal=${drawingNumber}`)
  )

  // if (!response.ok) {
  //   return {
  //     code: response.status,
  //     message: response.statusText,
  //     data: undefined,
  //   }
  // }
  // const result = await response.json()
  // //result._embedded.drawings[0] _embedded for test need to discuss
  // return { code: 200, message: 'success', data: result.content[0] }
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: response?.data.content[0],
    page: response?.data.page,
  }
}
