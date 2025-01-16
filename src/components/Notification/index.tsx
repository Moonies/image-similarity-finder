'use client'

import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
} from '@mui/material'
import { useNotification } from '@/hooks/useNotification'
import { StyledAlert } from './style'

export const Notification: React.FC = () => {
  const { notificationModal, notificationSnackbar, modal, snackbar } = useNotification()

  // Determine which notification to render
  const renderNotification = () => {
    // Modal has priority
    if (modal.open) {
      return (
        <Dialog
          open={modal.open}
          onClose={(event, reason) => {
            if (reason !== 'backdropClick') {
              notificationModal.close()
            }
          }}
          aria-labelledby='notification-dialog-title'
          aria-describedby='notification-dialog-description'
          sx={{ zIndex: theme => theme.zIndex.modal + 1 }}
        >
          <DialogTitle
            id='notification-dialog-title'
            sx={theme => ({
              backgroundColor: (() => {
                switch (modal.type) {
                  case 'error':
                    return theme.palette.error.main
                  case 'warning':
                    return theme.palette.warning.main
                  case 'success':
                    return theme.palette.success.main
                  case 'info':
                  default:
                    return theme.palette.info.main
                }
              })(),
              color: (() => {
                switch (modal.type) {
                  case 'error':
                    return theme.palette.error.contrastText
                  case 'warning':
                    return theme.palette.warning.contrastText
                  case 'success':
                    return theme.palette.success.contrastText
                  case 'info':
                  default:
                    return theme.palette.info.contrastText
                }
              })(),
            })}
          >
            {modal.type.toUpperCase()} Notification
          </DialogTitle>
          <DialogContent>
            <DialogContentText id='notification-dialog-description'>
              {modal.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={notificationModal.close} color='primary' autoFocus>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )
    }

    // Fallback to Snackbar
    if (snackbar.open) {
      return (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={notificationSnackbar.close}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <StyledAlert
            onClose={notificationSnackbar.close}
            severity={snackbar.type}
            variant='filled'
            sx={{
              width: '100%',
              color: 'white',
              whiteSpace: 'pre-line',
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            {snackbar.message}
          </StyledAlert>
        </Snackbar>
      )
    }

    // No notification to render
    return null
  }

  // Single return with conditional rendering
  return renderNotification()
}
