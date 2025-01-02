'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { clearCredentials, setCredentials } from '@/store/slices/authSlice'
import { LoginModal } from '@/components/modals/LoginModal'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated } = useAppSelector(state => state.auth)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isTokenValidating, setIsTokenValidating] = useState(true)

  // Check and validate token
  const validateToken = useCallback(
    async (token: string | null) => {
      setIsTokenValidating(true)

      try {
        if (!token) {
          throw new Error('No token')
        }

        // Validate token with your backend
        // const userData = await validateTokenService(token)
        let userData = {
          id: 'Test001',
          email: 'test@sansenshimizu.com',
          name: 'testChan',
        }
        // If validation successful, set credentials
        dispatch(
          setCredentials({
            user: userData,
            token: token,
          })
        )

        // If currently on login page, redirect to dashboard
        // if (pathname === '/login') {
        //   router.push('/dashboard')
        // }
      } catch (error) {
        // Token invalid or expired
        localStorage.removeItem('token')
        dispatch(clearCredentials())

        // Show login modal or redirect based on route
        if (pathname !== '/login') {
          setShowLoginModal(true)
        }
      } finally {
        setIsTokenValidating(false)
      }
    },
    [pathname, dispatch, setShowLoginModal, setIsTokenValidating]
  )

  useEffect(() => {
    const token = localStorage.getItem('token')
    // console.log(pathname)
    // Only validate if token exists
    if (token) {
      validateToken(token)
    } else {
      // No token and not on login page
      setIsTokenValidating(false)
      if (pathname !== '/login') {
        setShowLoginModal(true)
      }
    }
  }, [pathname])

  // Protect routes
  useEffect(() => {
    const protectedRoutes = ['/']

    if (!isAuthenticated && protectedRoutes.includes(pathname)) {
      // router.push('/login')
      setShowLoginModal(true)
    }
  }, [isAuthenticated, pathname])

  // Prevent rendering children until token validation is complete
  if (isTokenValidating) {
    return null // Or a loading spinner
  }

  return (
    <>
      {children}
      <LoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onCancle={() => console.log('cancle')}
      />
    </>
  )
}
