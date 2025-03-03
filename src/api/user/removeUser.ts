import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export default async function removeUser(
  httpRequest: HttpRequest,
  userId: string
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() => axiosInstance.delete(`/api/users/${userId}`))

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: response?.data.content,
  }
}
