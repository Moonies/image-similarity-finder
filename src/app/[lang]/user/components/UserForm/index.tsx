'use client'

import React, { useEffect, useState } from 'react'
import { Drawer, Box, IconButton, Typography, Button, TextField, MenuItem } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import TextFieldBox from '@/components/TextFieldBox'
import { useTranslation } from 'react-i18next'
import { UpdateUserDetail } from '@/api/user/updateUserDetail'
import { UserDetail } from '@/api/user/getUserList'

interface UserFormProps {
  open: boolean
  initialData: Partial<UserDetail>
  onClose: () => void
  onSubmit: (formData: UpdateUserDetail) => void
  mode?: 'add' | 'edit'
}
const mockRole = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
]
export default function UserForm({
  onClose,
  onSubmit,
  open,
  initialData,
  mode = 'edit',
}: UserFormProps) {
  const { t } = useTranslation('user-page')
  const [recordData, setRecordData] = useState<Partial<UserDetail>>()

  const handleChange = (name: keyof UserDetail, value: string | number | null) => {
    setRecordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (mode === 'add') {
      //somthing add
      onSubmit(recordData as UpdateUserDetail)
    } else {
      //print on view mode
    }
  }

  useEffect(() => {
    setRecordData(initialData)

    return () => {}
  }, [initialData])
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
          <Typography variant='h4'>{t('title')}</Typography>
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
            id='inputField-drawingNumber'
            text={t('form.inputField1')}
            value={recordData?.username ?? ''}
            onChange={e => handleChange('username', e.target.value)}
          />
          <TextFieldBox
            id='inputField-name'
            text={t('form.inputField2')}
            value={recordData?.name ?? ''}
            onChange={e => handleChange('name', e.target.value)}
          />
          <TextFieldBox
            id='inputField-materialCost'
            text={t('form.inputField3')}
            value={recordData?.lastname ?? ''}
            onChange={e => handleChange('lastname', e.target.value)}
          />
          <TextFieldBox
            id='inputField-materialSup'
            text={t('form.inputField4')}
            value={recordData?.email ?? ''}
            onChange={e => handleChange('email', e.target.value)}
          />
          <TextField
            id='outlined-select-currency'
            select
            label='Role'
            helperText='Please select your currency'
          >
            {mockRole.map(option => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box display={'flex'} flexDirection={'column'} flex={1} justifyContent={'flex-end'}>
          <Button variant='contained' onClick={handleSubmit}>
            {mode === 'add' ? t('saveButton') : t('printButton')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
