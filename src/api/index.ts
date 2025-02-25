import { getCurrentToken } from '@/store/slices/authSlice'
import axios, { AxiosInstance } from 'axios'

export type ApiResponse<T> = {
  code: number | string
  message: string
  data: T | null | undefined
  page?: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  } | null
}

// export const createFetchInstance = (baseURL: string) => {
//   return async (path: string, options: RequestInit = {}) => {
//     const storedToken = getCurrentToken()

//     // Base headers that can be fully replaced if needed
//     const defaultHeaders: Record<string, string> = {
//       Accept: '*/*',
//       'Access-Control-Allow-Origin': '*',
//       Authorization: storedToken ? `Bearer ${storedToken.token}` : '',
//     }

//     // Add Content-Type only if it's not FormData
//     if (!(options.body instanceof FormData)) {
//       defaultHeaders['Content-Type'] = 'application/json'
//     }

//     const requestOptions: RequestInit = {
//       ...options,
//       headers: options.headers ? { ...defaultHeaders, ...options.headers } : defaultHeaders,
//     }

//     return fetch(`${baseURL}${path}`, requestOptions)
//   }
// }

// export const fetchInstance = createFetchInstance(
//   process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
// )

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 300000, // 5 minute
  headers: {
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  },
})

// Set up interceptor to ensure token is always current
axiosInstance.interceptors.request.use(
  config => {
    const storedToken = getCurrentToken()
    if (storedToken) {
      config.headers.Authorization = `Bearer ${storedToken.token}` // Best practice: use Authorization header
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
