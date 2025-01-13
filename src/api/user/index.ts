import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import { default as login, UserData } from './login'
import { default as checkAuth, AuthData } from './checkAuth'

export interface UserApi {
  login: (username: string, password: string) => Promise<ApiResponse<UserData>>
  checkAuth: (username: string, refreshToken: string) => Promise<ApiResponse<AuthData>>
}

export default function user(httpRequest: HttpRequest): UserApi {
  return {
    login: (username, password) => login(username, password), //not use authorization bearer
    checkAuth: (username, refreshToken) => checkAuth(username, refreshToken), //not use authorization bearer
  }
}
