import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import { default as checkAuth, AuthData } from './checkAuth'

export interface UserApi {
  checkAuth: (username: string, password: string) => Promise<ApiResponse<AuthData>>
}

export default function user(httpRequest: HttpRequest): UserApi {
  return {
    checkAuth: (username, password) => checkAuth(httpRequest, username, password), //not use authorization bearer
  }
}
