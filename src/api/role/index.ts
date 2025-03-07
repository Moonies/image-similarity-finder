import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import { default as getRoleList, RoleDetail } from './getRoleList'
import { default as addNewRole, AddNewRole } from './addNewRole'
import { default as removeRole } from './removeRole'
export interface RoleApi {
  getRoleList: () => Promise<ApiResponse<RoleDetail[]>>
  addNewRole: (params: AddNewRole) => Promise<ApiResponse<null>>
  removeRole: (roleId: string) => Promise<ApiResponse<null>>
}

export default function role(httpRequest: HttpRequest): RoleApi {
  return {
    getRoleList: () => getRoleList(httpRequest),
    addNewRole: params => addNewRole(httpRequest, params),
    removeRole: roleId => removeRole(httpRequest, roleId),
  }
}
