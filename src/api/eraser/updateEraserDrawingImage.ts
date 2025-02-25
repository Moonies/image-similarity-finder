import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export default async function updateEraserDrawingImage(
  httpRequest: HttpRequest,
  processedFile: File
): Promise<ApiResponse<null>> {
  const formData = new FormData()
  console.log(processedFile)
  formData.append('file', processedFile, processedFile.name)

  const response = await httpRequest(() =>
    axiosInstance.post(`/api/erase/save`, formData, {
      // responseType: 'blob',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
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
