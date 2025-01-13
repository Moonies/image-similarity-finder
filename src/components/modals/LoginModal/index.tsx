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
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(username, password)
      onClose() // Close modal on successful login
    } catch (error) {
      // Handle login error (could add error state to show message)
      console.error('Login failed', error)
    }
  }

  const handleClose = useCallback(
    (reason: string) => {
      if (reason !== 'backdropClick') {
        onClose()
      }
    },
    [onClose]
  )

  return (
    <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={true} maxWidth='sm' fullWidth>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <Divider />
        <Box display={'flex'} flex={1} flexDirection={'column'} gap={2} padding={4}>
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
      <DialogActions>
        <Button onClick={onCancle} color='secondary' variant='contained'>
          Cancel
        </Button>
        <Button onClick={handleLogin} color='primary' variant='contained'>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}
