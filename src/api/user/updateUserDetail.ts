import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export type UpdateUserDetail = {
  id: string
  employeeNumber: string
  username: string
  name: string
  lastname: string
  email: string
}

export default async function updateUserDetail(
  httpRequest: HttpRequest,
  data: UpdateUserDetail
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.patch(`/api/drawings/${data.id}`, {
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
