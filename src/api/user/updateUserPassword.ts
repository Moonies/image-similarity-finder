import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export type UpdateUserPasswordDetail = {
  username: string
  newPassword: string
  resetPassword: string
}

export default async function updateUserDetail(
  httpRequest: HttpRequest,
  data: UpdateUserPasswordDetail
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.put(`/api/users/update-password`, {
      ...data,
    })
  )

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  return {
    code: 200,
    message: 'success',
    data: null,
  }
}
