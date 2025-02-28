import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface HttpState {
  acceptLanguage: string
}

const initialState: HttpState = {
  acceptLanguage: 'en-US',
}

const httpSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ acceptLanguage: string }>) => {
      state.acceptLanguage = action.payload.acceptLanguage
      // Save to localStorage
      if (typeof window !== 'undefined') {
        console.log('set token')
        localStorage.setItem('acceptLanguage', JSON.stringify(action.payload.acceptLanguage))
      }
    },
    clearLanguage: state => {
      state.acceptLanguage = 'en'
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('acceptLanguage')
      }
    },
  },
})

export const getCurrentLanguage = (): string | null => {
  const storedLanguage = localStorage.getItem('acceptLanguage')
  return storedLanguage ? JSON.parse(storedLanguage) : null
}

export const { setLanguage, clearLanguage } = httpSlice.actions
export default httpSlice.reducer
