import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import loadingReducer from './slices/loadingSlice'
import authReducer from './slices/authSlice'
import loginReducer from './slices/loginSlice'
import notificationReducer from './slices/notificationSlice'
import eraseReducer from './slices/eraseSlice'
import httpReducer from './slices/httpSlice'
import chatReducer from './slices/chatSlice'

const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['chat'],
}

const chatPersistConfig = {
  key: 'chat',
  storage,
  whitelist: ['chatHistory'],
}

const rootReducer = combineReducers({
  loading: loadingReducer,
  auth: authReducer,
  login: loginReducer,
  notification: notificationReducer,
  erase: eraseReducer,
  http: httpReducer,
  chat: persistReducer(chatPersistConfig, chatReducer),
  // ... other reducers
})

const persistedReducer = persistReducer(rootPersistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
