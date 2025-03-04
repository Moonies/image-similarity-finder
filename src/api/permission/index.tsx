import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse } from '@/api'
import { default as updatePermission } from './updatePermission'

export interface PermissionApi {
  updatePermission: (roleId: string, newPermision: string[]) => Promise<ApiResponse<null>>
}

export default function role(httpRequest: HttpRequest): PermissionApi {
  return {
    updatePermission: (roleId, newPermission) =>
      updatePermission(httpRequest, roleId, newPermission),
  }
}
