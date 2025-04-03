import { ApiResponse, getBaseURL } from '@/api'
import { getCurrentLanguage } from '@/store/slices/httpSlice'
import axios from 'axios'

export interface AuthData {
  expiration: string
  refreshExpiration: string
  refreshToken: string
  token: string
}

export default async function checkAuth(
  // httpRequest: HttpRequest,
  username: string,
  refreshToken: string
): Promise<ApiResponse<AuthData>> {
  //refresh token only without Authorization Header
  const baseURL = getBaseURL()
  try {
    const response = await axios.post(
      `${baseURL}/api/auth/refresh`,
      {
        username: username,
        refreshToken: refreshToken,
      },
      {
        headers: {
          ['Accept-Language']: getCurrentLanguage(),
        },
      }
    )

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
