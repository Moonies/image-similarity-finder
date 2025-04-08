'use client'

import { PropsWithChildren, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18next from '@/config/i18n'
import { redirect } from 'next/navigation'

type LanguageProviderProps = {
  locale?: string
} & PropsWithChildren

export default function LanguageProvider({ children, locale }: LanguageProviderProps) {
  useEffect(() => {
    const supportedLanguage = i18next.options.supportedLngs as string[]
    if (locale && supportedLanguage?.includes(locale)) {
      i18next.changeLanguage(locale)
    } else {
      redirect('/en')
    }
  }, [locale])

  return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>
}
