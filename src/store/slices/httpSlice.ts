import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HttpState {
  acceptLanguage: string
  baseURL: string
}

const initialState: HttpState = {
  acceptLanguage: 'en',
  baseURL: '',
}

const httpSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ acceptLanguage: string }>) => {
      state.acceptLanguage = action.payload.acceptLanguage
      // Save to localStorage
      localStorage.setItem('acceptLanguage', JSON.stringify(action.payload.acceptLanguage))
    },
    clearLanguage: state => {
      state.acceptLanguage = 'en'
      // Clear localStorage
      localStorage.removeItem('acceptLanguage')
    },
    setBaseUrl: (state, action: PayloadAction<{ locationHost: string; locationPort?: string }>) => {
      state.baseURL = action.payload.locationHost

      // Determine the port based on environment
      const env = process.env.NEXT_PUBLIC_ENV
      let port = '3000' // Default port

      if (env === 'development') {
        port = '8081' // config on your port
      } else if (env === 'preproduction') {
        port = '8081'
      } else if (env === 'production' && action.payload.locationPort) {
        port = action.payload.locationPort
      }

      // Construct the baseURL dynamically
      state.baseURL = `http://${action.payload.locationHost}:${port}`
    },
  },
})

export const getCurrentLanguage = (): string | null => {
  if (typeof window !== 'undefined') {
    const storedLanguage = localStorage.getItem('acceptLanguage')
    return storedLanguage ? JSON.parse(storedLanguage) : null
  }
  return null
}

export const { setLanguage, clearLanguage, setBaseUrl } = httpSlice.actions
export default httpSlice.reducer
