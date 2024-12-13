'use client'

import { Box, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import {
  Home as HomeIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Refresh as RefreshIcon,
  ImageSearch as ImageSearchIcon,
  Language as LanguageIcon,
} from '@mui/icons-material'
import React, { useCallback, useState } from 'react'
import { StyledDrawer, StyledSidebarButton } from './style'
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
  const { setLoading } = useLoading()

  const handleNavigation = (path: string) => {
    const lang = pathname.split('/')[1] // This will get 'en' from '/en/viewer'
    // Include language in the path
    router.push(`/${lang}${path}`)
  }

  const menuItems = [
    { label: 'Home', key: 'home', icon: HomeIcon, path: '/' },
    { label: 'Download', key: 'download', icon: DownloadIcon, path: '/Download' },
    { label: 'Back', key: 'back', icon: ArrowBackIcon, path: '' },
    { label: 'Foward', key: 'foward', icon: ArrowForwardIcon, path: '' },
    {
      label: mode === 'dark' ? 'Dark Mode' : 'Light Mode',
      key: 'mode',
      icon: mode === 'dark' ? DarkModeIcon : LightModeIcon,
      path: '',
    },
    { label: 'Reload', key: 'reload', icon: RefreshIcon, path: '' },
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
      case 'download':
      case 'preview':
        handleNavigation(path)
        break
      case 'mode':
        toggleTheme()
        break
      case 'language':
        console.log(currentLang)
        await i18n.changeLanguage(currentLang === 'en' ? 'jp' : 'en')
        setCurrentLang(i18n.language)
        // setLoading(true)
        updatePathname(i18n.language)
        break

      default:
        break
    }
  }

  return (
    <StyledDrawer variant='permanent' open={open}>
      <Box display={'flex'} flex={1} flexDirection={'column'}>
        <Box display={'flex'} flex={1} flexDirection={'column'}>
          {menuItems.map((item, index) => {
            return (
              <ListItemButton key={index} onClick={() => handleClick(item.key, item.path)}>
                <ListItemIcon>
                  <item.icon sx={{ color: 'white' }} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )
          })}
          {/* <ListItemButton onClick={() => handleNavigation('/')}>
            <ListItemIcon>
              <HomeIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='Home' />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DownloadIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='Download' />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ArrowBackIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='Back' />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <ArrowForwardIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='Foward' />
          </ListItemButton>
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>
              {mode === 'dark' ? (
                <DarkModeIcon sx={{ color: 'white' }} />
              ) : (
                <LightModeIcon sx={{ color: 'white' }} />
              )}
            </ListItemIcon>
            <ListItemText primary='Dark Mode' />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <RefreshIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='Reload' />
          </ListItemButton>
          <ListItemButton onClick={() => handleNavigation('/viewer')}>
            <ListItemIcon>
              <ImageSearchIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='Preview' />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <LanguageIcon sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary='En' />
          </ListItemButton> */}
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
