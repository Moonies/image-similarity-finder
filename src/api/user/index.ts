import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import { default as login, TokenData } from './login'
import { default as checkAuth, AuthData } from './checkAuth'
import { default as getUserList, UserListSearchCriteria, UserDetail } from './getUserList'
import { default as addNewUser, AddNewUser } from './addNewUser'
import { default as updateUserDetail, UpdateUserDetail } from './updateUserDetail'
import { default as removeUser } from './removeUser'
import { default as getUserDetail, UserProfile } from './getUserDetail'
import { default as getOtpResetPassword } from './getOtpResetPassword'
import { default as updateUserPassword, UpdateUserPasswordDetail } from './updateUserPassword'
import { default as logout } from './logout'
export interface UserApi {
  login: (username: string, password: string) => Promise<ApiResponse<TokenData>>
  checkAuth: (username: string, refreshToken: string) => Promise<ApiResponse<AuthData>>
  getUserList: (searchCriteria: UserListSearchCriteria) => Promise<ApiResponse<UserDetail[]>>
  addNewUser: (params: AddNewUser) => Promise<ApiResponse<null>>
  updateUserDetail: (params: UpdateUserDetail) => Promise<ApiResponse<null>>
  removeUser: (userId: string) => Promise<ApiResponse<null>>
  getUserDetail: (username: string) => Promise<ApiResponse<UserProfile>>
  getOtpResetPassword: (mail: string) => Promise<ApiResponse<null>>
  updateUserPassword: (params: UpdateUserPasswordDetail) => Promise<ApiResponse<null>>
  logout: () => Promise<ApiResponse<null>>
}

export default function user(httpRequest: HttpRequest): UserApi {
  return {
    login: (username, password) => login(username, password), //not use authorization bearer
    checkAuth: (username, refreshToken) => checkAuth(username, refreshToken), //not use authorization bearer
    getUserList: searchCriteria => getUserList(httpRequest, searchCriteria),
    addNewUser: params => addNewUser(httpRequest, params),
    updateUserDetail: params => updateUserDetail(httpRequest, params),
    removeUser: userId => removeUser(httpRequest, userId),
    getUserDetail: username => getUserDetail(httpRequest, username),
    getOtpResetPassword: mail => getOtpResetPassword(httpRequest, mail),
    updateUserPassword: params => updateUserPassword(httpRequest, params),
    logout: () => logout(),
  }
}
