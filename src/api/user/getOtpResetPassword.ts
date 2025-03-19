import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import axios from 'axios'
import { getCurrentLanguage } from '@/store/slices/httpSlice'

export default async function getOtpResetPassword(
  httpRequest: HttpRequest,
  mail: string
): Promise<ApiResponse<null>> {
  // const baseURL = process.env.NEXT_PUBLIC_API_URL
  const baseURL = `https://${window.location.hostname}:$8081`

  try {
    const response = await axios.post(
      `${baseURL}/api/auth/forgot-password`,
      { mail: mail },
      {
        headers: {
          'Accept-Language': getCurrentLanguage(),
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
