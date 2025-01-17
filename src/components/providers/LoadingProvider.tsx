'use client'

import React, { createContext, useState, ReactNode, useCallback } from 'react'
import { Backdrop, CircularProgress } from '@mui/material'

interface LoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
  // withLoading: <T>(
  //   fn: () => Promise<T> | T,
  //   options?: {
  //     catchError?: boolean
  //   }
  // ) => Promise<T | undefined>
  withLoading: <T>(promise: Promise<T>) => Promise<T>
}

export const LoadingContext = createContext<LoadingContextType>({
  isLoading: false,
  setLoading: () => {},
  withLoading: promise => promise,
})

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false)

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading)
  }, [])

  // const withLoading = useCallback(
  //   async <T,>(
  //     fn: () => Promise<T> | T,
  //     options: { catchError?: boolean } = { catchError: true }
  //   ): Promise<T | undefined> => {
  //     try {
  //       setIsLoading(true)
  //       const result = await Promise.resolve(fn())
  //       return result
  //     } catch (error) {
  //       if (!options.catchError) {
  //         throw error
  //       }
  //       console.error('Loading error:', error)
  //       return undefined
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   },
  //   []
  // )

  const withLoading = useCallback(async <T,>(promise: Promise<T>): Promise<T> => {
    setIsLoading(true)
    try {
      const result = await promise
      return result
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, withLoading }}>
      {children}
      <Backdrop
        sx={{
          color: '#fff',
          zIndex: theme => theme.zIndex.drawer + 1000,
        }}
        open={isLoading}
      >
        <CircularProgress color='inherit' />
      </Backdrop>
    </LoadingContext.Provider>
  )
}
