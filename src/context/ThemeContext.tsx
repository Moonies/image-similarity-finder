'use client'
import React, { createContext, useState, useContext, useEffect } from 'react'
import { ThemeMode, getTheme, muiLocales } from '@/theme/theme'
import { useTranslation } from 'react-i18next'
import { usePathname } from 'next/navigation'

type Locale = 'en' | 'jp' | 'zh' | 'vi'
interface ThemeContextType {
  mode: ThemeMode
  theme: ReturnType<typeof getTheme>
  toggleTheme: () => void
  setMode: (mode: ThemeMode) => void
  locale: Locale
  setLocale: (locale: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  theme: getTheme('light'),
  toggleTheme: () => {},
  setMode: () => {},
  locale: 'en',
  setLocale: () => {},
})

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('light')
  const { i18n } = useTranslation()
  const pathname = usePathname()

  const [locale, setLocale] = useState<Locale>((i18n.language as Locale) ?? 'en')
  const theme = getTheme(mode, muiLocales[locale])

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('theme', newMode)
  }

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode)
    localStorage.setItem('theme', newMode)
  }

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale as Locale)
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeMode
      if (savedTheme) {
        setMode(savedTheme)
      }
    }
    const [lang, _currentPath] = pathname.replace(/^\//, '').split('/')
    if (locale !== lang) {
      setLocale(lang as Locale)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme,
        toggleTheme,
        setMode: setThemeMode,
        locale,
        setLocale: changeLocale,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
