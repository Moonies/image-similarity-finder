'use client'
import React, { createContext, useState, useContext } from 'react'
import { ThemeMode, getTheme } from '@/theme/theme'

interface ThemeContextType {
  mode: ThemeMode
  theme: ReturnType<typeof getTheme>
  toggleTheme: () => void
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  theme: getTheme('light'),
  toggleTheme: () => {},
  setMode: () => {},
})

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as ThemeMode
      return savedTheme || 'light'
    }
    return 'light'
  })

  const theme = getTheme(mode)

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light'
    setMode(newMode)
    localStorage.setItem('theme', newMode)
  }

  const setThemeMode = (newMode: ThemeMode) => {
    setMode(newMode)
    localStorage.setItem('theme', newMode)
  }

  return (
    <ThemeContext.Provider
      value={{
        mode,
        theme,
        toggleTheme,
        setMode: setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
