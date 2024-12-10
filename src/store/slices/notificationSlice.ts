import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface NotificationState {
  modal: {
    open: boolean
    message: string
    type: NotificationType
  }
  snackbar: {
    open: boolean
    message: string
    type: NotificationType
  }
}

const initialState: NotificationState = {
  modal: {
    open: false,
    message: '',
    type: 'info',
  },
  snackbar: {
    open: false,
    message: '',
    type: 'info',
  },
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Modal Notifications
    openModalNotification: (
      state,
      action: PayloadAction<{
        message: string
        type?: NotificationType
      }>
    ) => {
      state.modal.open = true
      state.modal.message = action.payload.message
      state.modal.type = action.payload.type || 'info'
    },
    closeModalNotification: state => {
      state.modal.open = false
      state.modal.message = ''
    },

    // Snackbar Notifications
    openSnackbarNotification: (
      state,
      action: PayloadAction<{
        message: string
        type?: NotificationType
      }>
    ) => {
      state.snackbar.open = true
      state.snackbar.message = action.payload.message
      state.snackbar.type = action.payload.type || 'info'
    },
    closeSnackbarNotification: state => {
      state.snackbar.open = false
      state.snackbar.message = ''
    },
  },
})

export const {
  openModalNotification,
  closeModalNotification,
  openSnackbarNotification,
  closeSnackbarNotification,
} = notificationSlice.actions

export default notificationSlice.reducer
