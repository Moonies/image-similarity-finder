import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import axios from 'axios'

export default async function checkExistDrawing(
  httpRequest: HttpRequest,
  drawingNumber: string
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/drawings?drawingNumber.equal=${drawingNumber}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  if (response?.status === 200 && response.data.content.length === 0) {
    return {
      code: 404,
      message: 'success',
      data: null,
    }
  }
  return {
    code: 200,
    message: 'success',
    data: response?.data,
  }
}
