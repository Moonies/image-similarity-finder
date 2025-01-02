'use client'

import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material'
import {
  Home as HomeIcon,
  Upload as UploadIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Refresh as RefreshIcon,
  ImageSearch as ImageSearchIcon,
  Language as LanguageIcon,
  ContentPaste as ContentPasteIcon,
} from '@mui/icons-material'
import React, { useCallback, useEffect, useState } from 'react'
import { StyledDrawer, StyledSelect, StyledSidebarButton } from './style'
import { useRouter, usePathname } from 'next/navigation'
import { useThemeContext } from '@/context/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useLoading } from '@/hooks/useLoading'

export default function SideMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { toggleTheme, mode } = useThemeContext()
  const { i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState(i18n.language)
  const [languageSwitcher, SetLanguageSwitcher] = useState(i18n.language)
  const { setLoading } = useLoading()

  const handleNavigation = (path: string) => {
    const [lang, currentPath] = pathname.replace(/^\//, '').split('/') // This will get 'en' and 'currentpaht' from '/en/viewer'
    if (path === `/${currentPath}`) return
    router.push(`/${lang}${path}`)
  }

  const menuItems = [
    { label: 'Home', key: 'home', icon: HomeIcon, path: '/' },
    { label: 'Upload', key: 'search', icon: UploadIcon, path: '/upload' },
    { label: 'Back', key: 'back', icon: ArrowBackIcon, path: '' },
    { label: 'Foward', key: 'foward', icon: ArrowForwardIcon, path: '' },
    {
      label: mode === 'dark' ? 'Dark Mode' : 'Light Mode',
      key: 'mode',
      icon: mode === 'dark' ? DarkModeIcon : LightModeIcon,
      path: '',
    },
    { label: 'Reload', key: 'reload', icon: RefreshIcon, path: '' },
    { label: 'Database', key: 'database', icon: ContentPasteIcon, path: '/record' },
    { label: 'Image Preview', key: 'preview', icon: ImageSearchIcon, path: '/viewer' },
    { label: 'En', key: 'language', icon: LanguageIcon, path: '' },
  ]
  const updatePathname = (lng: string) => {
    // Extract the current path without the language prefix
    const pathWithoutLang = pathname.split('/').slice(2).join('/')

    // Update the URL with the new language
    window.history.replaceState({ lang: lng }, '', `/${lng}/${pathWithoutLang}`)
    // setLoading(false)
  }
  const handleClick = async (key: string, path: string) => {
    switch (key) {
      case 'home':
      case 'search':
      case 'preview':
      case 'database':
        handleNavigation(path)
        break
      case 'mode':
        toggleTheme()
        break

      default:
        break
    }
  }

  const getCurrnetGroupPath = () => {
    const currentGroupPath = pathname.split('/')
    return currentGroupPath[2]
  }

  const handleLanguageClick = async (event: SelectChangeEvent<unknown>) => {
    SetLanguageSwitcher(event.target.value as string)
    await i18n.changeLanguage(currentLang === 'en' ? 'jp' : 'en')
    setCurrentLang(i18n.language)
    // setLoading(true)
    updatePathname(i18n.language)
  }

  useEffect(() => {
    SetLanguageSwitcher(i18n.language)
    return () => {}
  }, [i18n.language])

  return (
    <StyledDrawer variant='permanent' open={open}>
      <Box display={'flex'} flex={1} flexDirection={'column'}>
        <Box display={'flex'} flex={1} flexDirection={'column'}>
          {menuItems.map((item, index) => {
            return item.key !== 'language' ? (
              <ListItemButton
                key={index}
                onClick={() => handleClick(item.key, item.path)}
                selected={item.path === `/${getCurrnetGroupPath()}`}
              >
                <ListItemIcon>
                  <item.icon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ) : (
              <StyledSelect
                labelId='select-label-language'
                id='select'
                value={languageSwitcher}
                onChange={handleLanguageClick}
                key={index}
                size='small'
              >
                <MenuItem value={'en'}>En</MenuItem>
                <MenuItem value={'jp'}>Jp</MenuItem>
              </StyledSelect>
            )
          })}
        </Box>
        <Box flex={1} display={'flex'} alignItems={'flex-end'}>
          <StyledSidebarButton onClick={() => setOpen(!open)}>
            {open ? <ArrowBackIcon /> : <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
          </StyledSidebarButton>
        </Box>
      </Box>
    </StyledDrawer>
  )
}
