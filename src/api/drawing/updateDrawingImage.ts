import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import axios from 'axios'

export default async function updateDrawingImage(
  httpRequest: HttpRequest,
  newImageFile: File,
  drawingId: string,
  disableDisplayError?: boolean
): Promise<ApiResponse<null>> {
  const formData = new FormData()
  formData.append('file', newImageFile)

  const response = await httpRequest(() =>
    axiosInstance.post(`/api/drawings/update-drawing/${drawingId}`, formData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    })
  )
  if (axios.isAxiosError(response)) {
    return {
      code: response?.code ?? 500,
      message: response.message,
      data: undefined,
    }
  }
  return { code: 200, message: 'success', data: null }
}
