import { getCurrentToken } from '@/store/slices/authSlice'
import { getCurrentLanguage } from '@/store/slices/httpSlice'

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

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', //for dev
  // baseURL: `http://${window.location.hostname}:8081`, // for pre-production
  // baseURL: `https://${window.location.hostname}:${window.location.port}`, // for production
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
      config.headers['Accept-Language'] = getCurrentLanguage()
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Response Interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response // Return successful responses as-is
  },
  async error => {
    if (error.response && error.response.data) {
      const contentType = error.response.headers['content-type']

      if (contentType && contentType.includes('application/json')) {
        try {
          const text = await error.response.data.text() // Convert Blob to text
          const json = JSON.parse(text) // Parse JSON
          error.response.data = json // Replace Blob with parsed JSON
        } catch (err) {
          console.error('Failed to parse JSON:', err)
        }
      }
    }

    return Promise.reject(error) // Reject the error
  }
)
