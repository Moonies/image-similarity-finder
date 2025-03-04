'use client'
import PageTransition from '@/components/PageTransition'
import { Box, Button } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

import { useCallback, useEffect, useMemo, useState } from 'react'
import DataTable from '@/components/DataTable'
import { GridRowId, useGridApiRef } from '@mui/x-data-grid'
import RoleForm from './components/RoleForm'
import CustomColumn from './components/CustomColumn'
import { useTranslation } from 'react-i18next'
import { useConfirmModal } from '@/hooks/useConfirm'
import { AddNewRole } from '@/api/role/addNewRole'
import useRole from './hooks/useRole'
import { useNotification } from '@/hooks/useNotification'

export default function RolePage() {
  const { t } = useTranslation('user-page')
  const roleDataGridRef = useGridApiRef()
  const [openRoleForm, setOpenRoleForm] = useState(false)
  const { openConfirmModal } = useConfirmModal()
  const { notificationSnackbar } = useNotification()
  const { addNewRole, removeRole, getRoleList, roleList, handlePermissionChange, permissionsList } =
    useRole()

  const convertHeaderName = useMemo(
    () => (permissionKey: string) => {
      switch (permissionKey) {
        case 'home':
          return 'Home Page'
        case 'search':
          return 'Upload Page'
        case 'database':
          return 'Check Recoard Page'
        case 'eraser':
          return 'Eraser Page'
        case 'chat':
          return 'Chat With Database Page'
        case 'user':
          return 'User Management Page'
        case 'role':
          return 'Role And Permission Page'
        default:
          return `${permissionKey.charAt(0).toUpperCase()}${permissionKey.slice(1)} page`
      }
    },
    []
  )

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      const selectedData = roleList.find(role => role.id === id)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: t('notification.titleConfirmRemove'),
          message: ` ${t('notification.confirmRemoveMessage')} ${selectedData.name}`,
        })
        if (confirmed) {
          const response = await removeRole(selectedData?.id)
          if (response) {
            notificationSnackbar.success(t('notification.success.remove'))
            getRoleList()
          }
        }
      }
    },
    [getRoleList, notificationSnackbar, openConfirmModal, removeRole, roleList, t]
  )

  const columns = useMemo(
    () =>
      CustomColumn({
        remove: handleDeleteClick,
        t: t,
        convertHeaderName: convertHeaderName,
        handlePermissionChange: handlePermissionChange,
        permissionList: permissionsList,
      }),
    [convertHeaderName, handleDeleteClick, handlePermissionChange, permissionsList, t]
  )

  const handleAddClick = useCallback(() => {
    setOpenRoleForm(true)
  }, [])

  const handleSubmit = useCallback(
    async (formData: AddNewRole) => {
      const response = await addNewRole(formData)
      if (response) {
        notificationSnackbar.success('Add New Role Success!!')
        setOpenRoleForm(false)
        getRoleList()
      }
    },
    [addNewRole, getRoleList, notificationSnackbar]
  )

  useEffect(() => {
    getRoleList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageTransition>
      <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
        <Box display={'flex'} flexDirection={'row'}>
          <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'end'}>
            <Button variant='contained' startIcon={<AddIcon />} onClick={handleAddClick}>
              {/* {t('addButton')} */}
              Add New Role
            </Button>
          </Box>
        </Box>
        <Box marginTop={2} flex={1}>
          <DataTable
            data={roleList}
            columns={columns}
            apiref={roleDataGridRef}
            onSelected={selectedRow => console.log(selectedRow)}
            hideFooterPagination
            rowSelection={false}
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
        <RoleForm
          open={openRoleForm}
          onClose={() => {
            setOpenRoleForm(false)
          }}
          onSubmit={handleSubmit}
          permissionList={permissionsList}
        />
      </Box>
    </PageTransition>
  )
}
