import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { DrawingImageDetail } from '@/api/drawing'
import axios from 'axios'

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
    axiosInstance.get(`/api/drawings?${category}.contains=${keyword}&page=${page}&size=${pageSize}`)
  )

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: response?.data.content,
  }
}
