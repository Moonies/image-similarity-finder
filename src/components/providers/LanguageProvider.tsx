'use client'

import { PropsWithChildren, useEffect } from 'react'
import { I18nextProvider } from 'react-i18next'
import i18n from '@/config/i18n'

type LanguageProviderProps = {
  locale?: string
} & PropsWithChildren

export default function LanguageProvider({ children, locale }: LanguageProviderProps) {
  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale)
    }
  }, [locale])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
