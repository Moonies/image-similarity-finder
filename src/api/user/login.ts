import { ApiResponse } from '@/api'
import axios from 'axios'

export interface TokenData {
  expiration: string
  refreshExpiration: string
  refreshToken: string
  token: string
}

export default async function login(
  username: string,
  password: string
): Promise<ApiResponse<TokenData>> {
  console.log('SSL_Cert', process.env.SSL_CERTIFICATE)
  console.log('server-key', process.env.CERTIFICATE_KEY)

  const baseURL = process.env.NEXT_PUBLIC_API_URL
  // const baseURL = `http://${window.location.hostname}:8081`

  try {
    const response = await axios.post(`${baseURL}/api/auth/login`, {
      username: username,
      password: password,
    })

    return { code: 200, message: 'success', data: response.data }
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        code: error.response.status,
        message: error.response.data.message || 'An error occurred during authentication',
        data: null,
      }
    } else if (axios.isAxiosError(error)) {
      return {
        code: error.code ?? 500,
        message: error.message,
        data: null,
      }
    }
    return {
      code: 500,
      message: 'An unexpected error occurred',
      data: null,
    }
  }
}
