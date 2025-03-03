'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Drawer, Box, IconButton, Typography, Button } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import TextFieldBox from '@/components/TextFieldBox'
import { useTranslation } from 'react-i18next'
import { UserDetail } from '@/api/user/getUserList'
import useHttp from '@/hooks/useHttp'
import { RoleDetail } from '@/api/role/getRoleList'
import { AddNewUser } from '@/api/user/addNewUser'

type UserFormData = UserDetail & { password?: string }
interface UserFormProps {
  open: boolean
  initialData: Partial<UserFormData>
  onClose: () => void
  onSubmit: (formData: UserDetail | AddNewUser) => void
  mode?: 'add' | 'edit'
}

export default function UserForm({
  onClose,
  onSubmit,
  open,
  initialData,
  mode = 'edit',
}: UserFormProps) {
  const { t } = useTranslation('user-page')
  const [recordData, setRecordData] = useState<Partial<UserFormData>>()
  const [roleList, setRoleList] = useState<RoleDetail[]>([])
  const { api } = useHttp()

  const handleChange = (name: keyof UserFormData, value: string | number | null) => {
    setRecordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (mode === 'add') {
      onSubmit(recordData as AddNewUser)
    } else {
      onSubmit(recordData as UserDetail)
    }
  }

  const getRoleList = useCallback(async () => {
    const result = await api.role.RoleList()
    if (result.code === 200 && result.data) {
      setRoleList(result.data)
    }
  }, [api.role])

  useEffect(() => {
    setRecordData(initialData)
    return () => {}
  }, [initialData])

  useEffect(() => {
    getRoleList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Drawer
      anchor={'right'}
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown={true}
      sx={{
        '& .MuiDrawer-paper': {
          width: '40%',
        },
      }}
    >
      <Box display={'flex'} flex={1} flexDirection={'column'} gap={2} height={'100%'}>
        <Box display={'flex'} justifyContent={'space-between'} padding={2}>
          <Typography variant='h4'> {mode === 'add' ? t('title.add') : t('title.edit')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          flexShrink={1}
          paddingX={4}
          sx={{ overflowY: 'auto' }}
        >
          <TextFieldBox
            id='inputField-employeeNumber'
            text={t('form.inputField1')}
            value={recordData?.number ?? ''}
            onChange={e => handleChange('number', e.target.value)}
          />
          <TextFieldBox
            id='inputField-username'
            text={t('form.inputField2')}
            value={recordData?.username ?? ''}
            onChange={e => handleChange('username', e.target.value)}
          />
          {mode === 'add' && (
            <TextFieldBox
              id='inputField-password'
              text={t('form.inputField3')}
              value={recordData?.password ?? ''}
              onChange={e => handleChange('password', e.target.value)}
            />
          )}
          <TextFieldBox
            id='inputField-firstname'
            text={t('form.inputField4')}
            value={recordData?.firstName ?? ''}
            onChange={e => handleChange('firstName', e.target.value)}
          />
          <TextFieldBox
            id='inputField-lastname'
            text={t('form.inputField5')}
            value={recordData?.lastName ?? ''}
            onChange={e => handleChange('lastName', e.target.value)}
          />
          <TextFieldBox
            id='inputField-materialSup'
            text={t('form.inputField6')}
            value={recordData?.mail ?? ''}
            onChange={e => handleChange('mail', e.target.value)}
          />
          {/* for unmount state */}
          {roleList && (
            <TextFieldBox
              text={t('form.inputField7')}
              value={recordData?.roleId ?? ''}
              list={roleList}
              select
              onChange={e => handleChange('roleId', e.target.value as string)}
            />
          )}
        </Box>
        <Box display={'flex'} flexDirection={'column'} flex={1} justifyContent={'flex-end'}>
          <Button variant='contained' onClick={handleSubmit}>
            {t('saveButton')}
            {/* {mode === 'add' ? t('saveButton') : t('printButton')} */}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
