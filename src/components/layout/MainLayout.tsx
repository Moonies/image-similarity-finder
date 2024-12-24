'use client'

import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import SideMenu from '@/components/SideMenu'

const MainContent = styled('main')({
  flexGrow: 1,
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  overflow: 'hidden',
})

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box sx={{ display: 'flex' }}>
      <SideMenu />
      <MainContent sx={{ backgroundColor: theme => theme.palette.background.default }}>
        {children}
      </MainContent>
    </Box>
  )
}
