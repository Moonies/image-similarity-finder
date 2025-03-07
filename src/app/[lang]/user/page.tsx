'use client'

import DataTable from '@/components/DataTable'
import PageTransition from '@/components/PageTransition'
import { Box, Button, IconButton, InputAdornment, TextField } from '@mui/material'
import { GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Search as SearchIcon, PersonAdd as PersonAddIcon } from '@mui/icons-material'
import useUser from './hooks/useUser'
import CustomColumn from './components/CustomColumn'
import { useTranslation } from 'react-i18next'
import UserForm from './components/UserForm'
import { UserDetail } from '@/api/user/getUserList'
import { AddNewUser } from '@/api/user/addNewUser'
import { UpdateUserDetail } from '@/api/user/updateUserDetail'
import { useNotification } from '@/hooks/useNotification'
import { useConfirmModal } from '@/hooks/useConfirm'
import ResetPasswordModal from '@/components/modals/ResetPasswordModal'
import { useLoading } from '@/hooks/useLoading'

export default function UserPage() {
  const { t } = useTranslation('user-page')
  const [openUserForm, setOpenUserForm] = useState(false)
  const [openResetPasswordModal, setOpenResetPasswordModal] = useState(false)
  const [userFormMode, setUserFormMode] = useState<'add' | 'edit'>()
  const [selectedUserDetail, setSelectedUserDetail] = useState<Partial<UserDetail>>({})
  const { notificationSnackbar } = useNotification()
  const { openConfirmModal } = useConfirmModal()
  const { setLoading } = useLoading()
  const userDataGridRef = useGridApiRef()
  const {
    handleChange,
    handlePaginationModelChange,
    totalRows,
    userList,
    searchCriteria,
    paginationModel,
    handleSearch,
    addNewUser,
    updateUserDetail,
    removeUser,
    getOtpResetPassword,
    updateUserPassword,
  } = useUser()

  const handleEditClick = useCallback(
    (id: GridRowId) => () => {
      const selectedData = userList.find(user => user.id === id)
      if (selectedData) {
        setSelectedUserDetail(selectedData)
        setUserFormMode('edit')
        setOpenUserForm(true)
      }
    },
    [userList]
  )

  const handleDeleteClick = useCallback(
    (id: GridRowId) => async () => {
      const selectedData = userList.find(user => user.id === id)
      if (selectedData) {
        const confirmed = await openConfirmModal({
          title: t('notification.titleConfirmRemove'),
          message: ` ${t('notification.confirmRemoveMessage')} ${selectedData.username}`,
        })
        if (confirmed) {
          const result = await removeUser(selectedData?.id)
          if (result) {
            notificationSnackbar.success(t('notification.success.remove'))
            handleSearch()
          }
        }
      }
    },
    [handleSearch, notificationSnackbar, openConfirmModal, removeUser, t, userList]
  )

  const handleResetPasswordClick = useCallback(
    (id: GridRowId) => async () => {
      setLoading(true)
      const selectedData = userList.find(user => user.id === id)
      if (selectedData) {
        setSelectedUserDetail(selectedData)
        const response = await getOtpResetPassword(selectedData.mail)
        if (response) {
          setLoading(false)
          setOpenResetPasswordModal(true)
        }
      } else {
        //please select user before click bah blah
      }
    },
    [getOtpResetPassword, setLoading, userList]
  )

  const handleAddClick = useCallback(() => {
    setUserFormMode('add')
    setOpenUserForm(true)
    setSelectedUserDetail({})
  }, [])

  const handleSubmit = useCallback(
    async (formData: UserDetail | AddNewUser) => {
      console.log(formData)
      if ('id' in formData) {
        const newFormData: UpdateUserDetail = Object.fromEntries(
          Object.entries(formData).filter(([key]) => key !== 'role')
        ) as UpdateUserDetail
        const result = await updateUserDetail(newFormData)
        if (result) {
          notificationSnackbar.success(t('notification.success.update'))
          setOpenUserForm(false)
          setSelectedUserDetail({})
          handleSearch()
        }
      } else {
        const result = await addNewUser(formData)
        if (result) {
          notificationSnackbar.success(t('notification.success.add'))
          setOpenUserForm(false)
          setSelectedUserDetail({})
          handleSearch()
        }
      }
    },
    [addNewUser, handleSearch, notificationSnackbar, t, updateUserDetail]
  )

  const handleResetPassword = useCallback(
    async (newPassword: string, rePasswordCode: string) => {
      const response = await updateUserPassword({
        newPassword,
        resetPassword: rePasswordCode,
        username: selectedUserDetail.username ?? '',
      })

      if (response) {
        setOpenResetPasswordModal(false)
        setSelectedUserDetail({})
        notificationSnackbar.success('Update Password Success!!')
      }
    },
    [notificationSnackbar, selectedUserDetail.username, updateUserPassword]
  )

  const columns = useMemo(
    () =>
      CustomColumn({
        reset: handleResetPasswordClick,
        edit: handleEditClick,
        remove: handleDeleteClick,
        t: t,
      }),
    [handleDeleteClick, handleEditClick, handleResetPasswordClick, t]
  )

  useEffect(() => {}, [])
  return (
    <PageTransition>
      <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
        <Box display={'flex'} flexDirection={'row'}>
          <Box display={'flex'} width={'40%'}>
            <TextField
              fullWidth
              name='keyword'
              label={t('inputLabel')}
              value={searchCriteria.keyword}
              onChange={e => handleChange('keyword', e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position='start'>
                      <IconButton onClick={handleSearch}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Box>
          <Box display={'flex'} flex={1} alignItems={'center'} justifyContent={'end'}>
            <Button variant='contained' startIcon={<PersonAddIcon />} onClick={handleAddClick}>
              {t('addButton')}
            </Button>
          </Box>
        </Box>
        <Box marginTop={2} flex={1}>
          <DataTable
            data={userList}
            columns={columns}
            totalRows={totalRows}
            apiref={userDataGridRef}
            paginationModel={paginationModel}
            onSelected={selectedRow => console.log(selectedRow)}
            // onRowModesModelChange={handleRowModesModelChange}
            onPaginationModelChange={handlePaginationModelChange}
            // rowModesModel={rowModesModel}
            paginationMode='server'
            sx={{ height: '100%', width: '100%' }}
          />
        </Box>
        <UserForm
          open={openUserForm}
          initialData={selectedUserDetail}
          onClose={() => {
            setSelectedUserDetail({})
            setOpenUserForm(false)
          }}
          onSubmit={handleSubmit}
          mode={userFormMode}
        />
        {openResetPasswordModal && (
          <ResetPasswordModal
            onClose={() => setOpenResetPasswordModal(false)}
            onSubmit={handleResetPassword}
            open={openResetPasswordModal}
          />
        )}
      </Box>
    </PageTransition>
  )
}
