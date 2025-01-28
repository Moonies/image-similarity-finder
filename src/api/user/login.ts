import { ApiResponse } from '@/api'
import axios from 'axios'

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
  // const response = await fetch(baseURL + '/api/auth/login', {
  //   method: 'POST',
  //   headers: {
  //     Accept: '*/*',
  //     'Access-Control-Allow-Origin': '*',
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ username: username, password: password }),
  // })

  // if (!response.ok) {
  //   const errorData = await response.json()
  //   // console.log(errorData)
  //   return {
  //     code: errorData.status,
  //     message: errorData.message,
  //     data: undefined,
  //   }
  // }
  // const result = await response.json()

  // return { code: 200, message: 'success', data: result }
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
