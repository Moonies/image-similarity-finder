import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export default async function updateEraserDrawingImage(
  httpRequest: HttpRequest,
  predictorId: string
  // processedFile: File
): Promise<ApiResponse<null>> {
  // const formData = new FormData()
  // formData.append('file', processedFile, processedFile.name)
  const response = await httpRequest(() => axiosInstance.post(`/api/erase/save/${predictorId}`))
  if (axios.isAxiosError(response)) {
    return { code: response?.status ?? 500, message: response.message, data: undefined }
  }

  return {
    code: 200,
    message: 'success',
    data: null,
  }
}
