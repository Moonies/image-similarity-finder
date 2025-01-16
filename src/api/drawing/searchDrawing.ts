import { ApiResponse, fetchInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'

export default async function searchDrawing(
  httpRequest: HttpRequest,
  searchImage: File
): Promise<ApiResponse<Blob | undefined>> {
  const formData = new FormData()
  formData.append('file', searchImage)

  const response = await httpRequest(() =>
    fetchInstance('/api/drawings/search', {
      method: 'POST',
      body: formData,
    })
  )

  if (!response.ok) {
    console.log(response)
    // const errorData = await response.json()
    return {
      code: response.status,
      message: response.statusText,
      data: undefined,
    }
  }
  const result = await response.blob()

  return { code: 200, message: 'success', data: result }
}
