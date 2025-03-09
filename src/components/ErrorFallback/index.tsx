'use client'

import { Box, Button, Container, Divider, Link, Stack, Typography } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { useThemeContext } from '@/context/ThemeContext'
import { FallbackProps } from 'react-error-boundary'
import { useMemo } from 'react'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { mode } = useThemeContext()
  const pathname = usePathname()
  const { t } = useTranslation('error-page')

  const getCurrentURLPath = () => {
    return pathname.split('/')[2]
  }

  const convertPageName = useMemo(
    () => (pageName: string) => {
      switch (pageName) {
        case 'home':
          return t('pageName.home')
        case 'search':
          return t('pageName.search')
        case 'record':
          return t('pageName.record')
        case 'erase':
          return t('pageName.erase')
        case 'chat':
          return t('pageName.chat')
        case 'user':
          return t('pageName.user')
        default:
          return
      }
    },
    [t]
  )

  return (
    <Box sx={{ backgroundColor: theme => theme.palette.background.default, mt: 8 }}>
      <Container>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant='h3' sx={{ color: theme => theme.palette.error.main }}>
            {t('title')}
          </Typography>
          <SentimentVeryDissatisfiedIcon
            fontSize='large'
            sx={{ color: theme => theme.palette.error.main }}
          />
        </Stack>
        <Typography variant='h4' gutterBottom>
          {t('message', { pageName: convertPageName(getCurrentURLPath()) })}
        </Typography>
        <Typography variant='h5' sx={{ my: 3 }}>
          {t('errorMessageTitle')} : ({error.message})
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
          <Typography variant='h5'>{t('contactInfoTitle')}</Typography>
          <Link
            href='#'
            variant='h5'
            sx={{
              color:
                mode === 'dark'
                  ? theme => theme.palette.primary.light
                  : theme => theme.palette.primary.dark,
            }}
          >
            {t('contactInfoMessage')}
          </Link>
        </Stack>
        <Button variant='contained' onClick={resetErrorBoundary} sx={{ width: 200, my: 4, p: 2 }}>
          <Typography variant='h6'>{t('submitButton')}</Typography>
        </Button>
      </Container>
    </Box>
  )
}

export default ErrorFallback
