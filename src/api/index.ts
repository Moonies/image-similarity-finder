import { getCurrentToken } from '@/store/slices/authSlice'

export type ApiResponse<T> = {
  code: number
  message: string
  data: T | null | undefined
  page?: {
    size: number
    number: number
    totalElements: number
    totalPages: number
  } | null
}

export const createFetchInstance = (baseURL: string) => {
  return async (path: string, options: RequestInit = {}) => {
    const storedToken = getCurrentToken()

    // Base headers that can be fully replaced if needed
    const defaultHeaders: Record<string, string> = {
      Accept: '*/*',
      'Access-Control-Allow-Origin': '*',
      Authorization: storedToken ? `Bearer ${storedToken.token}` : '',
    }

    // Add Content-Type only if it's not FormData
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json'
    }

    const requestOptions: RequestInit = {
      ...options,
      headers: options.headers ? { ...defaultHeaders, ...options.headers } : defaultHeaders,
    }

    return fetch(`${baseURL}${path}`, requestOptions)
  }
}

export const fetchInstance = createFetchInstance(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
)
