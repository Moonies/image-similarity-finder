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
import { useThemeContext } from '@/context/ThemeContext'
import SideMenu from '@/components/SideMenu'

const MainContent = styled('main')({
  flexGrow: 1,
  display: 'flex',
  minHeight: '100vh',
})

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <MainContent>{children}</MainContent>
    </Box>
  )
}
