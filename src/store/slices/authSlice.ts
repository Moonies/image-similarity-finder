import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type TokenData = {
  expiration: string
  refreshExpiration: string
  refreshToken: string
  token: string
}

interface AuthState {
  isAuthenticated: boolean
  user: string | null
  token: TokenData | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: string; token: TokenData }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token

      // Save to localStorage
      if (typeof window !== 'undefined') {
        console.log('set token')
        localStorage.setItem('token', JSON.stringify(action.payload.token))
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
    },
    clearCredentials: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    logout: state => {
      state.isAuthenticated = false
      state.user = null
      state.token = null

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
  },
})

export const getCurrentToken = (): TokenData | null => {
  const storedToken = localStorage.getItem('token')
  return storedToken ? (JSON.parse(storedToken) as TokenData) : null
}

export const getCurrentUser = (): string => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? (JSON.parse(storedUser) as string) : ''
}

export const { setCredentials, clearCredentials, logout } = authSlice.actions
export default authSlice.reducer
