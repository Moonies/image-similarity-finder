import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import { default as login, UserData } from './login'
import { default as checkAuth, AuthData } from './checkAuth'
import { default as getUserList, UserListSearchCriteria, UserDetail } from './getUserList'
import { default as addNewUser, AddNewUser } from './addNewUser'
import { default as updateUserDetail, UpdateUserDetail } from './updateUserDetail'
import { default as removeUser } from './removeUser'
export interface UserApi {
  login: (username: string, password: string) => Promise<ApiResponse<UserData>>
  checkAuth: (username: string, refreshToken: string) => Promise<ApiResponse<AuthData>>
  getUserList: (searchCriteria: UserListSearchCriteria) => Promise<ApiResponse<UserDetail[]>>
  addNewUser: (params: AddNewUser) => Promise<ApiResponse<null>>
  updateUserDetail: (params: UpdateUserDetail) => Promise<ApiResponse<null>>
  removeUser: (userId: string) => Promise<ApiResponse<null>>
}

export default function user(httpRequest: HttpRequest): UserApi {
  return {
    login: (username, password) => login(username, password), //not use authorization bearer
    checkAuth: (username, refreshToken) => checkAuth(username, refreshToken), //not use authorization bearer
    getUserList: searchCriteria => getUserList(httpRequest, searchCriteria),
    addNewUser: params => addNewUser(httpRequest, params),
    updateUserDetail: params => updateUserDetail(httpRequest, params),
    removeUser: userId => removeUser(httpRequest, userId),
  }
}
