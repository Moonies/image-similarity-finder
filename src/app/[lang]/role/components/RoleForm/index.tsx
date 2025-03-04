'use client'

import { useMemo, useState } from 'react'
import {
  Drawer,
  Box,
  IconButton,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import TextFieldBox from '@/components/TextFieldBox'
import { useTranslation } from 'react-i18next'
import { AddNewRole } from '@/api/role/addNewRole'

interface RoleFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (formData: AddNewRole) => void
  permissionList: string[]
}

export default function RoleForm({ onClose, onSubmit, open, permissionList }: RoleFormProps) {
  const { t } = useTranslation('user-page')
  const [newRole, setNewRole] = useState('')
  const [newPermisson, setNewPermission] = useState<string[]>([])

  const handleSubmit = () => {
    // onSubmit()
    const addNewRoleParams: AddNewRole = {
      name: newRole,
      permissions: newPermisson,
      label: '',
      // authority:''
    }
    onSubmit(addNewRoleParams)
  }
  const handleChange = (value: string) => {
    if (newPermisson.includes(value)) {
      // Remove from checkedValues if already checked
      setNewPermission(newPermisson.filter(item => item !== value))
    } else {
      // Add to checkedValues if not checked
      setNewPermission([...newPermisson, value])
    }
  }

  const convertPermissionName = useMemo(
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
          <Typography variant='h4'> Add New Role</Typography>
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
            id='inputField-newRole'
            text={'Role Name'}
            value={newRole}
            onChange={e => setNewRole(e.target.value)}
          />
          <Divider textAlign='left'>Permission Page</Divider>

          {/* for unmount state */}
          {permissionList && (
            <FormGroup>
              {permissionList.map((permission, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={newPermisson?.includes(permission)}
                        onChange={() => handleChange(permission)}
                      />
                    }
                    label={convertPermissionName(permission)}
                  />
                )
              })}
            </FormGroup>
          )}
        </Box>
        <Box display={'flex'} flexDirection={'column'} flex={1} justifyContent={'flex-end'}>
          <Button variant='contained' onClick={handleSubmit}>
            {t('saveButton')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
