import { ApiResponse, fetchInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'

export default async function getDrawingImage(
  httpRequest: HttpRequest,
  drawingId: string
): Promise<ApiResponse<string>> {
  const response = await httpRequest(() =>
    fetchInstance(`/api/drawings/get-drawing/${drawingId}`, {
      method: 'GET',
    })
  )

  if (!response.ok) {
    return {
      code: response.status,
      message: response.statusText,
      data: undefined,
    }
  }
  const result = await response.blob()
  const imageObjectURL = URL.createObjectURL(result)
  return { code: 200, message: 'success', data: imageObjectURL }
}
