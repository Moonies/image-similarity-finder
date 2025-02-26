import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNotification } from '@/hooks/useNotification'

interface AddNewDrawingModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (newDrawingFileName: string) => void
}
export default function AddNewDrawingModal({ open, onClose, onSubmit }: AddNewDrawingModalProps) {
  const { t } = useTranslation('common')
  const [newDrawingFileName, setNewDrawingFileName] = useState<string>('')
  const { notificationModal } = useNotification()

  const handleSubmit = () => {
    if (newDrawingFileName) {
      onSubmit(newDrawingFileName)
    } else {
      notificationModal.warning(t('alertNoneText'))
    }
  }

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown
      fullWidth
      maxWidth={'xs'}
      // keepMounted
      scroll={'paper'}
    >
      <DialogTitle
        sx={theme => ({
          backgroundColor: theme.palette.background.default,
        })}
      >
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>{t('titleSaveAs')}</Typography>
          <Box display={'flex'} gap={2}>
            <IconButton edge='end' color='inherit' onClick={() => onClose()} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <TextField
          // margin='dense'
          label={t('inputAddNewDrawingFileName')}
          fullWidth
          variant='outlined'
          value={newDrawingFileName}
          onChange={e => setNewDrawingFileName(e.target.value)}
        />
      </DialogContent>
      <DialogActions
        sx={theme => ({
          backgroundColor: theme.palette.background.default,
        })}
      >
        <Button variant='contained' onClick={handleSubmit}>
          {t('submitButton')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
