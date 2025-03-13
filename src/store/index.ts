import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from './slices/loadingSlice'
import authReducer from './slices/authSlice'
import loginReducer from './slices/loginSlice'
import notificationReducer from './slices/notificationSlice'
import eraseReducer from './slices/eraseSlice'
import httpReducer from './slices/httpSlice'
import chatReducer from './slices/chatSlice'

export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    auth: authReducer,
    login: loginReducer,
    notification: notificationReducer,
    erase: eraseReducer,
    http: httpReducer,
    chat: chatReducer,
    // ... other reducers
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
