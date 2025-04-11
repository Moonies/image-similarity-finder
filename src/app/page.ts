'use client'
import { redirect, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import i18next from '@/config/i18n'
import { getCurrentLanguage } from '@/store/slices/httpSlice'

export default function DefaultPage() {
  const pathname = usePathname()
  const [lang, _currentPath] = pathname.replace(/^\//, '').split('/')
  const supportedLanguage = i18next.options.supportedLngs as string[]

  useEffect(() => {
    const currentLanguage = getCurrentLanguage()
    if (currentLanguage) {
      redirect(`/${currentLanguage}`)
    } else if (supportedLanguage?.includes(lang)) {
      redirect(`/${lang}`)
    } else {
      redirect('/en')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])
}
