import {
  Home as HomeIcon,
  Upload as UploadIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Language as LanguageIcon,
  ManageAccounts as ManageAccountsIcon,
  Key as KeyIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useThemeContext } from '@/context/ThemeContext'
import { EraserIcon, ChatIcon, DatabaseIcon } from '@/components/customIcons'
import { useMemo } from 'react'
import useHttp from '@/hooks/useHttp'

export default function useMenu() {
  const { mode } = useThemeContext()
  const { api } = useHttp()
  const { t } = useTranslation('common')

  const checkLicense = useMemo(
    () => async (key: string) => {
      const result = await api.permission.checkLicense(key)
      if (result.code === 200) {
        return true
      } else {
        return false
      }
    },
    [api.permission]
  )

  const menuItems = [
    { label: t('sideMenu.home'), key: 'home', icon: HomeIcon, path: '/' },
    { label: t('sideMenu.search'), key: 'search', icon: UploadIcon, path: '/search' },
    { label: t('sideMenu.record'), key: 'database', icon: DatabaseIcon, path: '/record' },
    { label: t('sideMenu.eraser'), key: 'eraser', icon: EraserIcon, path: '/erase' },
    { label: t('sideMenu.chat'), key: 'chat', icon: ChatIcon, path: '/chat' },
    { label: t('sideMenu.user'), key: 'user', icon: ManageAccountsIcon, path: '/user' },
    { label: t('sideMenu.role'), key: 'role', icon: KeyIcon, path: '/role' },

    {
      label: mode === 'dark' ? t('sideMenu.dark') : t('sideMenu.light'),
      key: 'mode',
      icon: mode === 'dark' ? DarkModeIcon : LightModeIcon,
      path: '',
    },
    { label: '', key: 'language', icon: LanguageIcon, path: '' },
  ]
  const logoutMenu = t('sideMenu.logout')
  return { menuItems, logoutMenu, checkLicense }
}
