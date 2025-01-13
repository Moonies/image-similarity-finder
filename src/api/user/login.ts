import { ApiResponse } from '@/api'

export interface UserData {
  expiration: string
  refreshExpiration: string
  refreshToken: string
  token: string
}

export default async function login(
  username: string,
  password: string
): Promise<ApiResponse<UserData>> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL
  const response = await fetch(baseURL + '/api/auth/login', {
    method: 'POST',
    headers: {
      Accept: '*/*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username: username, password: password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    // console.log(errorData)
    return {
      code: errorData.status,
      message: errorData.message,
      data: undefined,
    }
  }
  const result = await response.json()

  return { code: 200, message: 'success', data: result }
}
