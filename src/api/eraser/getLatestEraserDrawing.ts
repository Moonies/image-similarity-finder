import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export default async function getLatestEraserDrawing(
  httpRequest: HttpRequest,
  predictorId: string,
  disableDisplayError = false
): Promise<ApiResponse<File>> {
  const response = await httpRequest(
    () =>
      axiosInstance.get(`/api/erase/save/${predictorId}`, {
        responseType: 'blob',
      }),
    disableDisplayError
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }

  return {
    code: 200,
    message: 'success',
    data: response?.data,
  }
}
