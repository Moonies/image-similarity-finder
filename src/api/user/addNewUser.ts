import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export type AddNewUser = {
  number: string
  username: string
  password: string
  firstname: string
  lastname: string
  mail: string
  roleId: string
}

export default async function addNewUser(
  httpRequest: HttpRequest,
  data: AddNewUser
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.post(`/api/users`, {
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
