import { ApiResponse, fetchInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { DrawingImageDetail } from '@/api/drawing'

export interface DrawingListSearchCriteria {
  category: string
  keyword?: string
  page: number
  pageSize: number
}

export default async function getDrawingList(
  httpRequest: HttpRequest,
  { category, keyword, page = 0, pageSize = 10 }: DrawingListSearchCriteria
): Promise<ApiResponse<DrawingImageDetail[]>> {
  const response = await httpRequest(() =>
    fetchInstance(`/api/drawings?${category}.contains=${keyword}&page=${page}&size=${pageSize}`, {
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
  return { code: 200, message: 'success', data: result.content, page: result?.page }
}
