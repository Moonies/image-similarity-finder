'use client'

import { Box, Button, Container, Divider, Link, Stack, Typography } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { ErrorBoundary, FallbackProps } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const pathname = usePathname()
  const { t } = useTranslation('common')

  const getCurrentURLPath = () => {
    return pathname.split('/')[2]
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Container>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant='h5' color='error'>
            {t('error.title')}
          </Typography>
          <SentimentVeryDissatisfiedIcon color='error' />
        </Stack>
        <Typography variant='h6' gutterBottom>
          {t('error.message', { pageName: t(`sideMenu.${getCurrentURLPath()}`) })}
        </Typography>
        <Typography variant='subtitle2' gutterBottom>
          {t('error.errorMessageTitle')} : ({error.message})
        </Typography>
        <Button variant='contained' onClick={resetErrorBoundary} sx={{ my: 2 }}>
          {t('error.submitButton')}
        </Button>
        <Divider />
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center', mt: 2 }}>
          <Typography>{t('error.contactInfoTitle')}</Typography>
          <Link href='#' variant='subtitle1' color='primary'>
            {t('error.contactInfoMessage')}
          </Link>
        </Stack>
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
