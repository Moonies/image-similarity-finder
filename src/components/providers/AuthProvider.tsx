'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAppDispatch } from '@/hooks/useRedux'
import { LoginModal } from '@/components/modals/LoginModal'
import useHttp from '@/hooks/useHttp'
import { useLoading } from '@/hooks/useLoading'
import { getCurrentToken } from '@/store/slices/authSlice'
import { setBaseUrl } from '@/store/slices/httpSlice'
import LicenseAdvertiseDialog from '@/components/dialog/LicenseAdvertiseDialog'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [lang, currentPath] = pathname.replace(/^\//, '').split('/')

  // const isAuthenticated = getAuthenticated()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [openAdvertise, setOpenAdvertise] = useState(false)
  const { setLoading } = useLoading()
  const { api } = useHttp()

  const checkLicensePlan = async (path: string) => {
    const response = await api.permission.checkLicense(`/${path}`)
    if (response.code !== 200) {
      router.push(`/${lang}`)
      setOpenAdvertise(true)
    }
  }

  useEffect(() => {
    const token = getCurrentToken()
    setLoading(true)
    // Only validate if token exists
    if (token) {
      setLoading(false) //for test token expire
      //if user change path in address bar, can be recheck again to protect pro features
      if (currentPath === 'erase' || currentPath === 'chat') {
        checkLicensePlan(currentPath)
      }
    } else {
      setLoading(false)
      // No token and not on login page
      setShowLoginModal(true)
      router.push(`/${lang}`)
    }
    //depend on path only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  // Protect routes
  // useEffect(() => {
  //   // const protectedRoutes = ['/']
  //   console.log('check rote', isAuthenticated)
  //   if (!isAuthenticated) {
  //     router.push(`/${lang}`)

  //     setShowLoginModal(true)
  //   }
  // }, [isAuthenticated, lang, pathname, router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname
      const port = process.env.NEXT_PUBLIC_ENV === 'production' ? window.location.port : undefined
      dispatch(setBaseUrl({ locationHost: hostname, locationPort: port })) // Store the hostname and compute baseURL
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      <LicenseAdvertiseDialog open={openAdvertise} onClose={() => setOpenAdvertise(false)} />
    </>
  )
}
