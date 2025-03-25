'use client'

import {
  Box,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon, Logout as LogoutIcon } from '@mui/icons-material'
import { useCallback, useEffect, useState } from 'react'
import { StyledDrawer, StyledSelect, StyledSidebarButton } from './style'
import { useRouter, usePathname } from 'next/navigation'
import { useThemeContext } from '@/context/ThemeContext'
import { useTranslation } from 'react-i18next'
import useMenu from './hooks/useMenu'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { getCurrentUser, logout } from '@/store/slices/authSlice'
import { setLanguage, clearLanguage } from '@/store/slices/httpSlice'
import { UserProfile } from '@/api/user/getUserDetail'
import { clearMessage } from '@/store/slices/chatSlice'
import { motion, AnimatePresence } from 'framer-motion'
import Image from '@/components/Image'
import LicenseAdvertiseDialog from '../dialog/LicenseAdvertiseDialog'

export default function SideMenu() {
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { toggleTheme, setLocale } = useThemeContext()
  const { i18n } = useTranslation()
  const [languageSwitcher, setLanguageSwitcher] = useState(i18n.language)
  const { menuItems, logoutMenu, checkLicense } = useMenu()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector(state => state.auth)
  const [storedUser, setStoredUser] = useState<UserProfile | null>()
  const [openAdvertise, setOpenAdvertise] = useState(false)

  const handleNavigation = useCallback(
    async (path: string) => {
      const [lang, _currentPath] = pathname.replace(/^\//, '').split('/') // This will get 'en' and 'currentpaht' from '/en/viewer'
      // if (path === `/${currentPath}`) return //if want to not return when still same parent path
      router.push(`/${lang}${path}`)
    },
    [pathname, router]
  )

  const checkLicenseVersion = useCallback(
    async (key: string, path: string) => {
      const response = await checkLicense(key)
      if (response) {
        handleNavigation(path)
      } else {
        setOpenAdvertise(true)
      }
    },
    [checkLicense, handleNavigation]
  )

  const updatePathname = (lng: string) => {
    // Extract the current path without the language prefix
    const pathWithoutLang = pathname.split('/').slice(2).join('/')

    // Update the URL with the new language
    window.history.replaceState({ lang: lng }, '', `/${lng}/${pathWithoutLang}`)
    // setLoading(false)
  }
  const handleClick = async (key: string, path: string) => {
    switch (key) {
      case 'mode':
        toggleTheme()
        break
      case 'eraser':
      case 'chat':
        checkLicenseVersion(key, path)
        break
      default:
        handleNavigation(path)
        break
    }
  }

  const getCurrnetGroupPath = () => {
    const currentGroupPath = pathname.split('/')
    return currentGroupPath[2]
  }

  const handleLanguageClick = async (event: SelectChangeEvent<unknown>) => {
    setLanguageSwitcher(event.target.value as string)
    await i18n.changeLanguage(event.target.value as string)
    dispatch(setLanguage({ acceptLanguage: i18n.language }))
    updatePathname(i18n.language)
    setLocale(i18n.language)
  }

  const handleLogoutClick = useCallback(() => {
    dispatch(clearMessage())
    dispatch(logout())
    dispatch(clearLanguage())
    router.push('/')
    router.refresh()
    window.location.reload()
  }, [dispatch, router])

  useEffect(() => {
    const [lang, _currentPath] = pathname.replace(/^\//, '').split('/')
    if (languageSwitcher !== lang) {
      setLanguageSwitcher(lang)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setStoredUser(getCurrentUser())
  }, [user])

  return (
    <StyledDrawer variant='permanent' open={open}>
      <Box display={'flex'} flex={1} flexDirection={'column'}>
        {storedUser && (
          <Box display={'flex'} flex={1} flexDirection={'column'}>
            {menuItems.map((item, index) => {
              if (
                (item.key !== 'language' && storedUser?.role.permissions.includes(item.key)) ||
                item.key === 'mode'
              ) {
                //&& storedUser?.role.permissions.includes(item.key) remove from if for test role & permission
                return (
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
                )
              } else if (item.key === 'language') {
                return (
                  <StyledSelect
                    labelId='select-label-language'
                    id='select-language'
                    value={languageSwitcher}
                    onChange={handleLanguageClick}
                    key={index}
                    size='small'
                  >
                    <MenuItem value={'en'} id='select-en'>
                      English
                    </MenuItem>
                    <MenuItem value={'jp'} id='select-jp'>
                      日本語
                    </MenuItem>
                    <MenuItem value={'zh'} id='select-zh'>
                      中文
                    </MenuItem>
                    <MenuItem value={'vi'} id='select-vi'>
                      Tiếng Việt
                    </MenuItem>
                  </StyledSelect>
                )
              }
            })}
          </Box>
        )}
        <Box flex={1} display={'flex'} flexDirection={'column'} justifyContent={'flex-end'}>
          <Box display={'flex'} padding={1} justifyContent={'center'}>
            <AnimatePresence mode='wait'>
              {open ? (
                <motion.div
                  key='logo'
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src='logoFull' alt='logo' width={220} />
                  <Typography variant='h6' textAlign={'center'}>
                    App version {process.env.APP_VERSION}
                  </Typography>
                </motion.div>
              ) : (
                <motion.div
                  key='logoMini'
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image src='logoMini' alt='logo' width={56} priority={true} />
                  <Typography variant='subtitle2' textAlign={'center'}>
                    {process.env.APP_VERSION}
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
          <Box display={'flex'}>
            <ListItemButton onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon sx={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary={logoutMenu} />
            </ListItemButton>
          </Box>
          <Box display={'flex'}>
            <StyledSidebarButton onClick={() => setOpen(!open)}>
              {open ? <ArrowBackIcon /> : <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
            </StyledSidebarButton>
          </Box>
        </Box>
      </Box>
      <LicenseAdvertiseDialog open={openAdvertise} onClose={() => setOpenAdvertise(false)} />
    </StyledDrawer>
  )
}
