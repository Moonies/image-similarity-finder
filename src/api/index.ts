import { store } from '@/store'
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

export const getBaseURL = (): string => {
  const state = store.getState() // Access the Redux store without hook
  const baseURL = state.http.baseURL // Get the baseURL from the Redux slice
  if (baseURL) {
    return baseURL
  }
  // Fallback if baseURL is not available
  return 'http://localhost:3000'
}

export const axiosInstance: AxiosInstance = axios.create({
  // baseURL: getBaseURL(),
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
    const stateBaseURL = getBaseURL()
    config.baseURL = stateBaseURL
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
