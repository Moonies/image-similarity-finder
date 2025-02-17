import { useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/store'
import {
  openModalNotification,
  closeModalNotification,
  openSnackbarNotification,
  closeSnackbarNotification,
} from '@/store/slices/notificationSlice'

export const useNotification = () => {
  const dispatch = useAppDispatch()
  const { modal, snackbar } = useAppSelector((state: RootState) => state.notification)

  // Modal Notification Methods
  const notificationModal = useMemo(
    () => ({
      info: (message: string) => {
        dispatch(openModalNotification({ message, type: 'info' }))
      },
      success: (message: string) => {
        dispatch(openModalNotification({ message, type: 'success' }))
      },
      warning: (message: string) => {
        dispatch(openModalNotification({ message, type: 'warning' }))
      },
      error: (message: string) => {
        dispatch(openModalNotification({ message, type: 'error' }))
      },
      close: () => {
        dispatch(closeModalNotification())
      },
    }),
    [dispatch]
  )

  // Snackbar Notification Methods
  const notificationSnackbar = useMemo(
    () => ({
      info: (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'info' }))
      },
      success: (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'success' }))
      },
      warning: (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'warning' }))
      },
      error: (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'error' }))
      },
      close: () => {
        dispatch(closeSnackbarNotification())
      },
    }),
    [dispatch]
  )

  return {
    notificationModal,
    notificationSnackbar,
    modal,
    snackbar,
  }
}
