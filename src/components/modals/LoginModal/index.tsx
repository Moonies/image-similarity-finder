'use client'

import React, { useState } from 'react'
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useLoading } from '@/hooks/useLoading'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onCancle: () => void
}

export const LoginModal: React.FC<LoginModalProps> = ({ open, onClose, onCancle }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const { setLoading } = useLoading()
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      await login(email, password)
      onClose() // Close modal on successful login
    } catch (error) {
      // Handle login error (could add error state to show message)
      console.error('Login failed', error)
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Login</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          label='Email'
          type='email'
          fullWidth
          variant='outlined'
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <TextField
          margin='dense'
          label='Password'
          type='password'
          fullWidth
          variant='outlined'
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancle} color='secondary'>
          Cancel
        </Button>
        <Button onClick={handleLogin} color='primary'>
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}
