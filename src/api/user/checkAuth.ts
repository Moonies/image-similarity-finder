import { ApiResponse, fetchInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'

export interface AuthData {
  token: string
  refreshToken: string
}

export default async function checkAuth(
  httpRequest: HttpRequest,
  username: string,
  password: string
): Promise<ApiResponse<AuthData>> {
  const response = await httpRequest(() =>
    fetchInstance('/api/product-units', {
      method: 'POST',
      // body: JSON.stringify(newSaleOrder)
    })
  )

  if (!response.ok) {
    return {
      code: response.status ?? 500,
      message: response.statusText,
      data: undefined,
    }
  }
  const result = await response.json()

  return { code: 200, message: 'success', data: result }
}
