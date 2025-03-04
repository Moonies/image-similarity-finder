import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export type UserProfile = {
  id: string
  username: string
  firstName: string
  lastName: string
  number: string
  mail: string
  role: {
    id: string
    name: string
    label: string
    permissions: string[]
    authority: string
  }
  roleId: string
}

export default async function getUserDetail(
  httpRequest: HttpRequest,
  username: string
): Promise<ApiResponse<UserProfile>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/users?username.equal=${username}`)
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: response?.data.content[0],
  }
}
