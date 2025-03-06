'use client'

import { Box, Button, Container, Divider, Link, Stack, Typography } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'
import { useThemeContext } from '@/context/ThemeContext'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { mode } = useThemeContext()
  const pathname = usePathname()
  const { t } = useTranslation('common')

  const getCurrentURLPath = () => {
    return pathname.split('/')[2]
  }

  return (
    <Box sx={{ backgroundColor: theme => theme.palette.background.default, mt: 8 }}>
      <Container>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant='h3' sx={{ color: theme => theme.palette.error.main }}>
            {t('error.title')}
          </Typography>
          <SentimentVeryDissatisfiedIcon
            fontSize='large'
            sx={{ color: theme => theme.palette.error.main }}
          />
        </Stack>
        <Typography variant='h4' gutterBottom>
          {t('error.message', { pageName: t(`sideMenu.${getCurrentURLPath()}`) })}
        </Typography>
        <Typography variant='h5' sx={{ my: 3 }}>
          {t('error.errorMessageTitle')} : ({error.message})
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center' }}>
          <Typography variant='h5'>{t('error.contactInfoTitle')}</Typography>
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
            {t('error.contactInfoMessage')}
          </Link>
        </Stack>
        <Button variant='contained' onClick={resetErrorBoundary} sx={{ width: 200, my: 4, p: 2 }}>
          <Typography variant='h6'>{t('error.submitButton')}</Typography>
        </Button>
      </Container>
    </Box>
  )
}

const ErrorProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        router.refresh()
      }}
    >
      {children}
    </ErrorBoundary>
  )
}

export default ErrorProvider
