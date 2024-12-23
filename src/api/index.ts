export type ApiResponse<T = any> = {
  code: number
  message: string
  data?: T
}

export const createFetchInstance = (baseURL: string) => {
  return async (path: string, options: RequestInit = {}) => {
    const token = localStorage.getItem('token') // Or your token management
    // const token =
    //   'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0VXNlciIsInRva2VuIjp0cnVlLCJyZWZyZXNoX3Rva2VuIjpmYWxzZSwiaWF0IjoxNzMzODkyMjgzLCJleHAiOjE3MzM4OTM0ODN9.wB2myI43Z2WajdHhjeNSr59v1N59UEuyJ_avserTHxw'
    const defaultOptions: RequestInit = {
      headers: {
        Accept: '*/*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    }

    return fetch(`${baseURL}${path}`, {
      ...defaultOptions,
      ...options,
    })
  }
}

export const fetchInstance = createFetchInstance(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
)
