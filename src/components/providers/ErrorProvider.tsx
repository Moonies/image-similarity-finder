'use client'

import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

const ErrorFallback = ({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: any
}) => {
  return (
    <Box sx={{ mt: 8 }}>
      <Container>
        <Stack spacing={1} direction='row' sx={{ alignItems: 'center', mb: 2 }}>
          <Typography variant='h6' color='error'>
            Something went wrong.
          </Typography>
          <SentimentVeryDissatisfiedIcon color='error' />
        </Stack>
        <Typography gutterBottom>{error.message}</Typography>
        <Button variant='contained' onClick={resetErrorBoundary} sx={{ my: 2 }}>
          Try Again
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
