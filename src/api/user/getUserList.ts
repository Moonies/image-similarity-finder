import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export interface UserListSearchCriteria {
  category: string
  keyword?: string
  page: number
  pageSize: number
}

type RoleDetail = {
  id: string
  name: string
  label: string
  permissions: string[]
  authority: string
}

export interface UserDetail {
  id: string
  number: string
  username: string
  firstName: string
  lastName: string
  mail: string
  role: RoleDetail
  roleId: string
}

export default async function getUserList(
  httpRequest: HttpRequest,
  { category, keyword, page = 0, pageSize = 10 }: UserListSearchCriteria
): Promise<ApiResponse<UserDetail[]>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/users?${category}.contains=${keyword}&page=${page}&size=${pageSize}`)
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
