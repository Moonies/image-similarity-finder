'use client'

import { styled, Theme, CSSObject } from '@mui/material/styles'
import {
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import {
  Home as HomeIcon,
  Download as DownloadIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  DarkMode as DarkModeIcon,
  Refresh as RefreshIcon,
  ImageSearch as ImageSearchIcon,
  Language as LanguageIcon,
} from '@mui/icons-material'
import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const drawerWidth = 240

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
})

const SideMenu = styled(Drawer, { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        backgroundColor: '#333',
        color: 'white',
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        backgroundColor: '#333',
        color: 'white',
      },
    }),
  })
)
const MainContent = styled('main')({
  flexGrow: 1,
  display: 'flex',
  minHeight: '100vh',
})

const SidebarButton = styled(IconButton)({
  color: 'white',
  margin: '8px 0',
  width: '100%',
  borderRadius: 0,
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
})

interface MainLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { label: 'Home', path: '/en' },
  { label: 'Viewer', path: '/en/viewer' },
  { label: 'Settings', path: '/en/settings' },
  { label: 'Profile', path: '/en/profile' },
]

export default function MainLayout({ children }: MainLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(false)
  const languages = ['English', '日本語', '한국어', '中文']

  // Get current language from pathname
  const lang = pathname.split('/')[1] // This will get 'en' from '/en/viewer'

  const handleNavigation = (path: string) => {
    // Include language in the path
    router.push(`/${lang}${path}`)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu variant='permanent' open={open}>
        <Box display={'flex'} flex={1} flexDirection={'column'}>
          <Box display={'flex'} flex={1} flexDirection={'column'}>
            <ListItemButton onClick={() => handleNavigation('/')}>
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
            <ListItemButton>
              <ListItemIcon>
                <DarkModeIcon sx={{ color: 'white' }} />
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
            </ListItemButton>
          </Box>
          <Box flex={1} display={'flex'} alignItems={'flex-end'}>
            <SidebarButton onClick={() => setOpen(!open)}>
              {open ? <ArrowBackIcon /> : <ArrowBackIcon sx={{ transform: 'rotate(180deg)' }} />}
            </SidebarButton>
          </Box>
        </Box>
      </SideMenu>
      <MainContent>{children}</MainContent>
    </Box>
  )
}
