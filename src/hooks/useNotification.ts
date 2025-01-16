import { useCallback } from 'react'
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
  const notificationModal = {
    info: useCallback(
      (message: string) => {
        dispatch(openModalNotification({ message, type: 'info' }))
      },
      [dispatch]
    ),

    success: useCallback(
      (message: string) => {
        dispatch(openModalNotification({ message, type: 'success' }))
      },
      [dispatch]
    ),

    warning: useCallback(
      (message: string) => {
        dispatch(openModalNotification({ message, type: 'warning' }))
      },
      [dispatch]
    ),

    error: useCallback(
      (message: string) => {
        dispatch(openModalNotification({ message, type: 'error' }))
      },
      [dispatch]
    ),

    close: useCallback(() => {
      dispatch(closeModalNotification())
    }, [dispatch]),
  }

  // Snackbar Notification Methods
  const notificationSnackbar = {
    info: useCallback(
      (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'info' }))
      },
      [dispatch]
    ),

    success: useCallback(
      (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'success' }))
      },
      [dispatch]
    ),

    warning: useCallback(
      (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'warning' }))
      },
      [dispatch]
    ),

    error: useCallback(
      (message: string) => {
        dispatch(openSnackbarNotification({ message, type: 'error' }))
      },
      [dispatch]
    ),

    close: useCallback(() => {
      dispatch(closeSnackbarNotification())
    }, [dispatch]),
  }

  return {
    notificationModal,
    notificationSnackbar,
    modal,
    snackbar,
  }
}
