import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import axios from 'axios'

export default async function resetEraserDrawingImage(
  httpRequest: HttpRequest,
  predictorId: string
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.delete(`/api/erase/delete/${predictorId}`, {
      // responseType: 'blob',
      headers: {
        'Access-Control-Allow-Origin': '*',
        // 'Content-Type': 'multipart/form-data',
      },
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
