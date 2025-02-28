import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export interface UserListSearchCriteria {
  category: string
  keyword?: string
  page: number
  pageSize: number
}

export interface UserDetail {
  id: string
  employeeNumber: string
  username: string
  name: string
  lastname: string
  email: string
  role: string
  //something
}

export default async function getUserList(
  httpRequest: HttpRequest,
  { category, keyword, page = 0, pageSize = 10 }: UserListSearchCriteria
): Promise<ApiResponse<UserDetail[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/users??${category}.contains=${keyword}&page=${page}&size=${pageSize}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: response?.data.content,
    page: response?.data.page,
  }
}
