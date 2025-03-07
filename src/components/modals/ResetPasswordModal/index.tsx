import React, { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { Box } from '@mui/system'
import TextFieldBox from '@/components/TextFieldBox'
import { useTranslation } from 'react-i18next'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (newPassword: string, rePasswordCode: string) => void
}

export default function ResetPasswordModal({ open, onClose, onSubmit }: LoginModalProps) {
  const { t } = useTranslation('user-page')
  const [rePasswordCode, setRepasswordCode] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(newPassword, rePasswordCode)
  }

  const handleClose = (event: object, reason: string) => {
    if (reason !== 'backdropClick') {
      onClose()
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} disableEscapeKeyDown={true} maxWidth='sm' fullWidth>
      <DialogTitle>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>{t('modal.title')}</Typography>
          <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextFieldBox
            id='inputField-newPassword'
            text={t('modal.inputField1')}
            value={newPassword}
            type='password'
            onChange={e => setNewPassword(e.target.value)}
          />
          <TextFieldBox
            id='inputField-rePasswordCode'
            text={t('modal.inputField2')}
            value={rePasswordCode}
            type='text'
            onChange={e => setRepasswordCode(e.target.value)}
          />
          <Typography variant='overline' gutterBottom sx={{ display: 'block' }}>
            ***{t('modal.helperInput')}***
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button type='submit' color='primary' variant='contained'>
            {t('saveButton')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
