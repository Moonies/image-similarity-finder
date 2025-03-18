import TextFieldBox from '@/components/TextFieldBox'
import { Box, Button, Dialog, DialogActions, DialogContent } from '@mui/material'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ResetPasswordDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (mail: string) => void
}

export default function ResetPasswordDialog({ open, onClose, onSubmit }: ResetPasswordDialogProps) {
  const { t } = useTranslation('common')
  const [mail, setMail] = useState<string>('')

  const handleSubmit = useCallback(() => {
    onSubmit(mail)
  }, [mail, onSubmit])

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
      <DialogContent>
        <Box display={'flex'} flex={1} flexDirection={'column'} gap={2}>
          <TextFieldBox
            autoFocus
            text={t('email')}
            value={mail}
            helperText={t('helperResetPassword')}
            onChange={e => setMail(e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Box display={'flex'} flex={1} justifyContent={'end'} gap={2}>
          <Button onClick={onClose} color='secondary' variant='contained'>
            {t('cancelButton')}
          </Button>
          <Button onClick={handleSubmit} color='primary' variant='contained'>
            {t('submitButton')}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}
