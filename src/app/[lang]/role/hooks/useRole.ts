import { AddNewRole } from '@/api/role/addNewRole'
import { RoleDetail } from '@/api/role/getRoleList'
import useHttp from '@/hooks/useHttp'
import { useLoading } from '@/hooks/useLoading'
import { useCallback, useMemo, useState } from 'react'

export default function useRole() {
  const [roleList, setRoleList] = useState<RoleDetail[]>([])
  const { api } = useHttp()
  const { setLoading } = useLoading()

  const permissionsList = useMemo(
    () => ['home', 'search', 'database', 'eraser', 'chat', 'user', 'role'],
    []
  )

  const addNewRole = useMemo(
    () => async (params: AddNewRole) => {
      const result = await api.role.addNewRole(params)
      if (result.code === 200) {
        return true
      }
    },
    [api.role]
  )

  const removeRole = useMemo(
    () => async (roleId: string) => {
      const result = await api.role.removeRole(roleId)
      if (result.code === 200) {
        return true
      }
    },
    [api.role]
  )

  const getRoleList = useMemo(
    () => async () => {
      const result = await api.role.getRoleList()
      if (result.code === 200 && result.data) {
        setRoleList(result.data)
      }
    },
    [api.role]
  )

  const updatePermission = useMemo(
    () => async (roleId: string, newPermission: string[]) => {
      const result = await api.permission.updatePermission(roleId, newPermission)
      if (result.code === 200) {
        return true
      }
    },
    [api.permission]
  )

  const handlePermissionChange = useCallback(
    async (rowId: string, permission: string) => {
      setLoading(true)
      let updatedPermissions: string[] = []
      setRoleList(prevRows =>
        prevRows.map(row => {
          if (row.id === rowId) {
            const hasPermission = row.permissions.includes(permission)
            updatedPermissions = hasPermission
              ? row.permissions.filter(perm => perm !== permission) // Remove permission
              : [...row.permissions, permission] // Add permission
            return {
              ...row,
              permissions: updatedPermissions,
            }
          }
          return row
        })
      )
      await updatePermission(rowId, updatedPermissions)
      setLoading(false)
    },
    [setLoading, updatePermission]
  )

  return { addNewRole, removeRole, getRoleList, roleList, handlePermissionChange, permissionsList }
}
