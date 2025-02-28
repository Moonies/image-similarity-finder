import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { DrawingImageDetail } from '@/api/drawing'
import axios from 'axios'

export default async function getDrawingDetail(
  httpRequest: HttpRequest,
  drawingNumber: string
): Promise<ApiResponse<DrawingImageDetail>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/drawings?drawingNumber.equal=${drawingNumber}`)
  )
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
