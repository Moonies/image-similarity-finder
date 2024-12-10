'use client'
import { useState, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { setCredentials, logout, User } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation'
import { useLoading } from './useLoading'

// Authentication service (replace with your actual implementation)
// import { authService } from '@/services/authService';

interface UseAuthHook {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshToken: () => Promise<void>
}

export function useAuth(): UseAuthHook {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { setLoading } = useLoading()
  // Get current auth state from Redux
  const { user, isAuthenticated } = useAppSelector(state => state.auth)

  // Login method
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      // const { user, token, refreshToken } = await authService.login(email, password);
      let user = {
        id: 'Test001',
        email: 'test@sansenshimizu.com',
        name: 'testChan',
      }
      let token = 'test ISF toke'
      let refreshToken = 'test ISF refreshToken'
      // Save tokens to localStorage
      localStorage.setItem('accessToken', token)
      localStorage.setItem('refreshToken', refreshToken)

      // Update Redux store
      dispatch(
        setCredentials({
          user,
          token,
        })
      )
    } catch (error) {
      // Handle login error
      console.error('Login failed', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout method
  const handleLogout = async () => {
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
  }

  // Token refresh method
  const refreshTokenMethod = async () => {
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
  }

  return {
    user,
    isAuthenticated,
    login,
    logout: handleLogout,
    refreshToken: refreshTokenMethod,
  }
}
