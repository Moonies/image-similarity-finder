import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '..'
import axios from 'axios'

export type AddNewRole = {
  name: string
  label: string
  permissions: string[]
  // authority: string
}

export default async function addNewRole(
  httpRequest: HttpRequest,
  data: AddNewRole
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.post(`/api/roles`, {
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
