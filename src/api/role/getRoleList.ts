import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export type RoleDetail = {
  id: string
  name: string
  label: string
  permissions: string[]
  authority: string
}

export default async function getRoleList(
  httpRequest: HttpRequest
): Promise<ApiResponse<RoleDetail[]>> {
  const response = await httpRequest(() => axiosInstance.get(`/api/roles`))
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
