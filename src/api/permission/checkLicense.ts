import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export default async function checkLicense(
  httpRequest: HttpRequest,
  feature: string
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() => axiosInstance.get(`/api/check-license${feature}`))

  if (axios.isAxiosError(response)) {
    return { code: response?.status ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: null,
  }
}
