import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material'
import React from 'react'
import { Close as CloseIcon } from '@mui/icons-material'
import { EraserIcon, ChatIcon } from '@/components/customIcons'
import { useTranslation } from 'react-i18next'
import { useThemeContext } from '@/context/ThemeContext'
interface LicenseAdvertiseDialogProps {
  open: boolean
  onClose: () => void
}

export default function LicenseAdvertiseDialog({ open, onClose }: LicenseAdvertiseDialogProps) {
  const { t } = useTranslation('notification')
  const { mode } = useThemeContext()

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose()
        }
      }}
      disableEscapeKeyDown={true}
      maxWidth='md'
      fullWidth
    >
      <DialogTitle sx={{ backgroundColor: theme => theme.palette.background.paper }}>
        <Box display={'flex'} flex={1}>
          <Box display={'flex'} flex={1}>
            <Typography
              variant='h4'
              sx={{
                color:
                  mode === 'dark'
                    ? theme => theme.palette.warning.light
                    : theme => theme.palette.primary.main,
              }}
            >
              {t('advertise.title')}
            </Typography>
          </Box>
          <Box display='flex' justifyContent={'flex-end'}>
            <IconButton edge='end' color='inherit' onClick={onClose} aria-label='close'>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <Divider sx={{ borderWidth: 1, borderColor: theme => theme.palette.secondary.light }} />
      <DialogContent
        sx={{ backgroundColor: theme => `${theme.palette.primary.light}50`, margin: 0 }}
      >
        <Box display={'flex'} flex={1} flexDirection={'column'} gap={2}>
          <Typography variant='subtitle1'>{t('advertise.subTitle')}</Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <EraserIcon />
              </ListItemIcon>
              {t('advertise.feature1')}
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              {t('advertise.feature2')}
            </ListItem>
          </List>
          <Typography>{t('advertise.footer')}</Typography>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
