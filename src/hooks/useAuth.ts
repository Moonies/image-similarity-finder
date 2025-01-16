'use client'
import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setCredentials, logout } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'
import { useLoading } from './useLoading'
import { useNotification } from './useNotification'
import useHttp from './useHttp'

// Authentication service (replace with your actual implementation)
// import { authService } from '@/services/authService';
export type TokenData = {
  token: string
  refreshToken: string
  expiration: string
  refreshExpiration: string
}
interface UseAuthHook {
  // user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean | undefined>
  logout: () => Promise<void>
  refreshToken: (newToken: any) => Promise<void> // now use any waiting API
  getCurrentToken: () => any // wait API
  getCurrentUser: () => any //wait API
}

export function useAuth(): UseAuthHook {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { setLoading } = useLoading()
  const { isAuthenticated } = useAppSelector(state => state.auth)
  const { notificationModal, notificationSnackbar } = useNotification()
  const { api } = useHttp()
  // Login method
  const login = useCallback(
    async (username: string, password: string) => {
      setLoading(true)
      try {
        // const { user, token, refreshToken } = await authService.login(email, password);
        const result = await api.user.login(username, password)
        if (result.code === 200 && result.data) {
          // let user = result.data
          dispatch(
            setCredentials({
              user: username,
              token: result.data,
            })
          )
          return true
        } else {
          switch (result.code) {
            case 401:
              // resetConfig()
              notificationSnackbar.error('Authentication failed:' + result.message)
              // onError('baseUrl')
              break
            case 403:
              notificationModal.error(
                'Authentication failed:' + result.message + '\n Please Check IP Again'
              )
              // onError('baseUrl')
              break
            default:
              notificationSnackbar.error('Authentication failed:' + result.message)

              break
          }
          return false
        }
      } catch (error) {
        // Handle login error
        console.error('Login failed', error)
        throw error
      } finally {
        setLoading(false)
      }
    },
    [api.user, dispatch, notificationModal, notificationSnackbar, setLoading]
  )

  // Logout method
  const handleLogout = useCallback(async () => {
    setLoading(true)
    try {
      // Call logout API if needed
      // await authService.logout();

      // Clear tokens from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      // Clear Redux store
      dispatch(logout())

      // Redirect to login
      router.push('/login')
    } catch (error) {
      console.error('Logout failed', error)
    } finally {
      setLoading(false)
    }
  }, [dispatch, router, setLoading])

  // Token refresh method
  const refreshTokenMethod = useCallback(
    async (newToken: any) => {
      setLoading(true)
      try {
        const refreshToken = localStorage.getItem('refreshToken')

        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        // Get new access token using refresh token
        // const { token, user } = await authService.refreshToken(refreshToken);

        // Update localStorage and Redux
        // localStorage.setItem('accessToken', token)
        // dispatch(
        //   setCredentials({
        //     user,
        //     token,
        //   })
        // )
      } catch (error) {
        // If refresh fails, force logout
        handleLogout()
      } finally {
        setLoading(false)
      }
    },
    [handleLogout, setLoading]
  )

  const getCurrentToken = useCallback(() => {
    try {
      const storedToken = localStorage.getItem('token')
      return storedToken ? (JSON.parse(storedToken) as any) : null //set any wait API
    } catch (error) {
      notificationModal.error(`${error}`)
    }
  }, [notificationModal])

  const getCurrentUser = useCallback(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? (JSON.parse(storedUser) as any) : null //set any wait API
    } catch (error) {
      notificationModal.error(`${error}`)
    }
  }, [notificationModal])

  return {
    // user,
    isAuthenticated,
    login,
    logout: handleLogout,
    refreshToken: refreshTokenMethod,
    getCurrentToken,
    getCurrentUser,
  }
}
