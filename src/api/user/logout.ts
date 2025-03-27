import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import axios from 'axios'

export default async function logout(httpRequest: HttpRequest): Promise<ApiResponse<null>> {
  const response = await httpRequest(() => axiosInstance.get(`/api/auth/logout`))
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: null,
  }
}
