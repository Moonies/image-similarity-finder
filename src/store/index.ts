import { configureStore } from '@reduxjs/toolkit'
import loadingReducer from './slices/loadingSlice'
import authReducer from './slices/authSlice'
import loginReducer from './slices/loginSlice'
import notificationReducer from './slices/notificationSlice'
export const store = configureStore({
  reducer: {
    loading: loadingReducer,
    auth: authReducer,
    login: loginReducer,
    notification: notificationReducer,
    // ... other reducers
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
