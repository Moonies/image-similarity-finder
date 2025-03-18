'use client'

import React, { useCallback, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Box,
  Divider,
} from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useLoading } from '@/hooks/useLoading'
import ResetPasswordDialog from '@/components/dialog/ResetPasswordDialog'
import useHttp from '@/hooks/useHttp'
import { useNotification } from '@/hooks/useNotification'
import { useTranslation } from 'react-i18next'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onCancle: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onCancle }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [openResetPasswordDialog, setOpenResetPasswordDialog] = useState(false)
  const { login } = useAuth()
  const { api } = useHttp()
  const { notificationSnackbar } = useNotification()
  const { t } = useTranslation('common')

  const { setLoading } = useLoading()
  const handleLogin = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      try {
        setLoading(true)
        const result = await login(username, password)
        if (result) onClose()
      } catch (error) {
        // Handle login error (could add error state to show message)
        console.error('Login failed', error)
      }
    },
    [login, onClose, password, setLoading, username]
  )

  const handleResetPassword = useCallback(
    async (mail: string) => {
      const result = await api.user.getOtpResetPassword(mail)
      if (result.code === 200) {
        notificationSnackbar.success('GET OTP is Success!! \n Please Check Your Email.')
      }
    },
    [api.user, notificationSnackbar]
  )

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown={true}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle>{t('loginModalTitle')}</DialogTitle>
      <form onSubmit={handleLogin}>
        <Divider />
        <DialogContent>
          <Box display={'flex'} flex={1} flexDirection={'column'} gap={2}>
            <TextField
              autoFocus
              label={t('username')}
              fullWidth
              variant='outlined'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              label={t('password')}
              type='password'
              fullWidth
              variant='outlined'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </Box>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Box display={'flex'} flex={1}>
            {/* <Box>
              <Button
                variant='outlined'
                color='secondary'
                onClick={() => setOpenResetPasswordDialog(true)}
              >
                forgot password
              </Button>
            </Box> */}
            <Box display={'flex'} flex={1} justifyContent={'end'} gap={2}>
              {/* <Button onClick={onCancle} color='secondary' variant='contained'>
                Cancel
              </Button> */}
              <Button type={'submit'} color='primary' variant='contained'>
                {t('loginButton')}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </form>
      {openResetPasswordDialog && (
        <ResetPasswordDialog
          open={openResetPasswordDialog}
          onClose={() => setOpenResetPasswordDialog(false)}
          onSubmit={handleResetPassword}
        />
      )}
    </Dialog>
  )
}
