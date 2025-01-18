import { ApiResponse, fetchInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { DrawingImageDetail } from '@/api/drawing'

export default async function getDrawingDetail(
  httpRequest: HttpRequest,
  drawingNumber: string
): Promise<ApiResponse<DrawingImageDetail>> {
  const response = await httpRequest(() =>
    fetchInstance(`/api/drawings?drawingNumber.equal=${drawingNumber}`, {
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
  const result = await response.json()
  //result._embedded.drawings[0] _embedded for test need to discuss
  return { code: 200, message: 'success', data: result.content[0] }
}
