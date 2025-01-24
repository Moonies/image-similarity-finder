'use client'

import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useState } from 'react'
import { StyledDrawer, StyledSelect, StyledSidebarButton } from './style'
import { useRouter, usePathname } from 'next/navigation'
import { useThemeContext } from '@/context/ThemeContext'
import { useTranslation } from 'react-i18next'
import useMenu from './hooks/useMenu'

export default function SideMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { toggleTheme } = useThemeContext()
  const { i18n } = useTranslation()
  const [languageSwitcher, SetLanguageSwitcher] = useState(i18n.language)
  const { menuItems } = useMenu()

  const handleNavigation = (path: string) => {
    const [lang, currentPath] = pathname.replace(/^\//, '').split('/') // This will get 'en' and 'currentpaht' from '/en/viewer'
    // if (path === `/${currentPath}`) return //if want to not return when still same parent path
    router.push(`/${lang}${path}`)
  }

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
    await i18n.changeLanguage(event.target.value as string)
    updatePathname(i18n.language)
  }

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
                <MenuItem value={'en'}>English</MenuItem>
                <MenuItem value={'jp'}>日本語</MenuItem>
                <MenuItem value={'cn'}>中文</MenuItem>
                <MenuItem value={'vn'}>Tiếng Việt</MenuItem>
              </StyledSelect>
            )
          })}
          {/* <ListItemText primary={t('home')} key={forceUpdate} /> */}
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
