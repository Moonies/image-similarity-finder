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

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onCancle: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onCancle }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()

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
      <DialogTitle>Login</DialogTitle>
      <form onSubmit={handleLogin}>
        <Divider />
        <DialogContent>
          <Box display={'flex'} flex={1} flexDirection={'column'} gap={2}>
            <TextField
              autoFocus
              // margin='dense'
              label='Username'
              fullWidth
              variant='outlined'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <TextField
              // margin='dense'
              label='Password'
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
            <Box>
              <Button variant='outlined' color='secondary'>
                forgot password
              </Button>
            </Box>
            <Box display={'flex'} flex={1} justifyContent={'end'} gap={2}>
              {/* <Button onClick={onCancle} color='secondary' variant='contained'>
                Cancel
              </Button> */}
              <Button type={'submit'} color='primary' variant='contained'>
                Login
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  )
}
