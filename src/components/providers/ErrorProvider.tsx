'use client'

import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { usePathname, useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: any
}) => {
  const pathname = usePathname()
  const { t } = useTranslation('common')

  const getCurrentURLPath = () => {
    return pathname.split('/')[2]
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Container>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' color='error'>
            {t('error.title')}
          </Typography>
          <SentimentVeryDissatisfiedIcon color='error' />
        </Stack>
        <Typography gutterBottom>
          {t('error.message', { pageName: t(`sideMenu.${getCurrentURLPath()}`) })}
        </Typography>
        <Button variant='contained' onClick={resetErrorBoundary} sx={{ my: 2 }}>
          {t('error.submitButton')}
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
