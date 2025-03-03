import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import { default as RoleList, RoleDetail } from './getRoleList'

export interface RoleApi {
  RoleList: () => Promise<ApiResponse<RoleDetail[]>>
}

export default function role(httpRequest: HttpRequest): RoleApi {
  return {
    RoleList: () => RoleList(httpRequest),
  }
}
