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
  // baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  baseURL: `https://${window.location.hostname}:8081`,
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
