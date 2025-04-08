import { UserProfile } from '@/api/user/getUserDetail'
import { TokenData } from '@/api/user/login'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  isAuthenticated: boolean
  user: UserProfile | null
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
    setCredentials: (state, action: PayloadAction<{ token: TokenData }>) => {
      state.isAuthenticated = true
      state.token = action.payload.token

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', JSON.stringify(action.payload.token))
        sessionStorage.setItem('authenticated', JSON.stringify(true))
      }
    },
    setUser: (state, action: PayloadAction<{ user: UserProfile }>) => {
      state.user = action.payload.user

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
    },
    setAuthenSession: state => {
      state.isAuthenticated = true
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('authenticated', JSON.stringify(true))
      }
    },
    clearCredentials: state => {
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    clearUser: state => {
      state.isAuthenticated = false
      state.user = null
      state.token = null

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        sessionStorage.removeItem('authenticated')
      }
    },
  },
})

export const getCurrentToken = (): TokenData | null => {
  const storedToken = localStorage.getItem('token')
  return storedToken ? (JSON.parse(storedToken) as TokenData) : null
}

export const getCurrentUser = (): UserProfile | null => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? (JSON.parse(storedUser) as UserProfile) : null
}

export const getAuthenticated = (): boolean => {
  if (typeof window !== 'undefined') {
    const storedAuthenticated = sessionStorage.getItem('authenticated')
    return storedAuthenticated ? (JSON.parse(storedAuthenticated) as boolean) : false
  }
  return false
}

export const { setCredentials, clearCredentials, clearUser, setUser, setAuthenSession } =
  authSlice.actions
export default authSlice.reducer
