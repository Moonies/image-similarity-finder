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
      }
    },
    setUser: (state, action: PayloadAction<{ user: UserProfile }>) => {
      state.user = action.payload.user

      // Save to localStorage
      if (typeof window !== 'undefined') {
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

export const getCurrentUser = (): UserProfile | null => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? (JSON.parse(storedUser) as UserProfile) : null
}

export const { setCredentials, clearCredentials, logout, setUser } = authSlice.actions
export default authSlice.reducer
