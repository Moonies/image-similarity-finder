import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export default async function removeRole(
  httpRequest: HttpRequest,
  roleId: string
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() => axiosInstance.delete(`/api/roles/${roleId}`))

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: response?.data.content,
  }
}
