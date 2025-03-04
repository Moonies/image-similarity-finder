import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '..'
import axios from 'axios'

export default async function updatePermission(
  httpRequest: HttpRequest,
  roleId: string,
  newPermission: string[]
): Promise<ApiResponse<null>> {
  const response = await httpRequest(() =>
    axiosInstance.patch(`/api/roles/${roleId}`, {
      id: roleId,
      permission: newPermission,
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
