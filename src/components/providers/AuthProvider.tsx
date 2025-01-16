'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { clearCredentials, setCredentials } from '@/store/slices/authSlice'
import { LoginModal } from '@/components/modals/LoginModal'
import useHttp from '@/hooks/useHttp'
import { useNotification } from '@/hooks/useNotification'
import { TokenData } from '@/hooks/useAuth'
import { useLoading } from '@/hooks/useLoading'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  // const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, user } = useAppSelector(state => state.auth)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isTokenValidating, setIsTokenValidating] = useState(true)
  const { notificationSnackbar } = useNotification()
  const { setLoading } = useLoading()
  const { api } = useHttp()

  // Check and validate token
  const validateToken = useRef(async (token: TokenData) => {
    setIsTokenValidating(true)
    const useStored = localStorage.getItem('user')
    const currentUser: string = isAuthenticated ? user : JSON.parse(useStored as string)
    try {
      if (!token) {
        throw new Error('No token')
      }
      const result = await api.user.checkAuth(currentUser, token.refreshToken)
      if (result.code === 200 && result.data) {
        // If validation successful, set credentials
        dispatch(
          setCredentials({
            user: currentUser,
            token: result.data,
          })
        )
        // router.push('/')
      } else {
        notificationSnackbar.error(result.message)
        localStorage.removeItem('token')
        dispatch(clearCredentials())

        // Show login modal or redirect based on route
        if (pathname !== '/login') {
          setShowLoginModal(true)
        }
      }
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
      setLoading(false)
    }
  })

  useEffect(() => {
    const token = localStorage.getItem('token')
    console.log(token)
    setLoading(true)
    // Only validate if token exists
    if (token) {
      setLoading(false) //for test token expire

      // validateToken.current(JSON.parse(token) as TokenData)
    } else {
      setLoading(false)
      // No token and not on login page
      setIsTokenValidating(false)
      setShowLoginModal(true)
      // }
    }
  }, [pathname, setLoading])

  // Protect routes
  useEffect(() => {
    const protectedRoutes = ['/']

    if (!isAuthenticated && protectedRoutes.includes(pathname)) {
      // router.push('/login')
      setShowLoginModal(true)
    }
  }, [isAuthenticated, pathname])

  //remove for not have a landing page
  // Prevent rendering children until token validation is complete
  // if (isTokenValidating) {
  //   return null // Or a loading spinner
  // }

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
