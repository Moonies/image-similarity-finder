//old version
// import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import type { RootState } from '@/store'

// interface User {
//   id: string
//   username: string
//   email: string
// }

// interface AuthState {
//   user: User | null
//   isAuthenticated: boolean
// }

// const initialState: AuthState = {
//   user: null,
//   isAuthenticated: false,
// }

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action: PayloadAction<User>) => {
//       state.user = action.payload
//       state.isAuthenticated = true
//     },
//     logout: state => {
//       state.user = null
//       state.isAuthenticated = false
//     },
//   },
// })

// export const { setUser, logout } = authSlice.actions
// export const selectUser = (state: RootState) => state.auth.user
// export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated

// export default authSlice.reducer
//version 2
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
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
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
      }
    },
    clearCredentials: state => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    },
    logout: state => {
      state.isAuthenticated = false
      state.user = null
      state.token = null

      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
      }
    },
  },
})

export const { setCredentials, clearCredentials, logout } = authSlice.actions
export default authSlice.reducer
