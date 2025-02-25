import {
  Home as HomeIcon,
  Upload as UploadIcon,
  // ArrowBack as ArrowBackIcon,
  // ArrowForward as ArrowForwardIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  // Refresh as RefreshIcon,
  // ImageSearch as ImageSearchIcon,
  Language as LanguageIcon,
  // ContentPaste as ContentPasteIcon,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useThemeContext } from '@/context/ThemeContext'
import { EraserIcon, ChatIcon, DatabaseIcon } from '@/components/customIcons'

export default function useMenu() {
  const { mode } = useThemeContext()

  const { t } = useTranslation('common')
  const menuItems = [
    { label: t('sideMenu.home'), key: 'home', icon: HomeIcon, path: '/' },
    { label: t('sideMenu.search'), key: 'search', icon: UploadIcon, path: '/search' },
    {
      label: mode === 'dark' ? t('sideMenu.dark') : t('sideMenu.light'),
      key: 'mode',
      icon: mode === 'dark' ? DarkModeIcon : LightModeIcon,
      path: '',
    },
    { label: t('sideMenu.record'), key: 'database', icon: DatabaseIcon, path: '/record' },
    { label: t('sideMenu.eraser'), key: 'eraser', icon: EraserIcon, path: '/erase' },
    { label: t('sideMenu.chat'), key: 'chat', icon: ChatIcon, path: '' },
    { label: '', key: 'language', icon: LanguageIcon, path: '' },
  ]
  const logoutMenu = t('sideMenu.logout')
  return { menuItems, logoutMenu }
}
