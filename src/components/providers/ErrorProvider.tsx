'use client'

import { useRouter } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '@/components/ErrorFallback'

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
