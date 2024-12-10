import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store'
import {
  openModalNotification,
  closeModalNotification,
  openSnackbarNotification,
  closeSnackbarNotification,
  NotificationType,
} from '@/store/slices/notificationSlice'

export const useNotification = () => {
  const dispatch = useDispatch()
  const { modal, snackbar } = useSelector((state: RootState) => state.notification)

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
