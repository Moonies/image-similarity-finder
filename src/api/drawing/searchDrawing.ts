import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import axios from 'axios'

export default async function searchDrawing(
  httpRequest: HttpRequest,
  searchImage: File,
  amount = 3
): Promise<ApiResponse<Blob | undefined>> {
  const formData = new FormData()
  formData.append('file', searchImage)
  formData.append('count', amount.toString())

  const response = await httpRequest(() =>
    axiosInstance.post('/api/drawings/search', formData, {
      responseType: 'blob',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return { code: 200, message: 'success', data: response?.data }
}
