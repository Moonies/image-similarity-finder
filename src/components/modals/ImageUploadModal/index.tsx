import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import React, { useCallback, useRef, useState } from 'react'
import InputUploadFile from '@/components/InputUploadFile'
import { useTranslation } from 'react-i18next'
import { useLoading } from '@/hooks/useLoading'

interface ImageUploadModalProps {
  open: boolean
  onClose: (newImage?: File) => void
}

export default function ImageUploadModal({ onClose, open }: ImageUploadModalProps) {
  const [uploadFile, setUploadFile] = useState<File>()
  const buttonUploadRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation('common')
  const { setLoading } = useLoading()

  const handleChooseFile = useCallback(
    (chooseFile: FileList | null) => {
      const file = chooseFile?.[0]
      //something event
      setUploadFile(file)
    },
    [setUploadFile]
  )

  const handleSubmit = useCallback(() => {
    if (uploadFile) {
      setLoading(true)
      onClose(uploadFile)
    }
  }, [onClose, setLoading, uploadFile])

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
      // TransitionComponent={Slide}
    >
      <DialogTitle
        sx={theme => ({
          backgroundColor: theme.palette.background.default,
        })}
      >
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <Typography variant='h6'>{t('uploadDrawingImageModalTitle')}</Typography>
          <Box display={'flex'} gap={2}>
            <IconButton edge='end' color='inherit' onClick={() => onClose()} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <InputUploadFile onChoose={files => handleChooseFile(files)} ref={buttonUploadRef} />
          <Typography>{uploadFile ? uploadFile.name : t('imagePlaceholder')}</Typography>
        </Box>
      </DialogContent>
      {uploadFile && (
        <DialogActions
          sx={theme => ({
            backgroundColor: theme.palette.background.default,
          })}
        >
          <Button variant='contained' onClick={handleSubmit}>
            {t('submitButton')}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  )
}
