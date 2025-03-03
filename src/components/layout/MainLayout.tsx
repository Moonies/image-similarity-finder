'use client'
import { Box } from '@mui/material'
import SideMenu from '@/components/SideMenu'
import { AnimatePresence } from 'framer-motion'

interface MainLayoutProps {
  children: React.ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <Box display={'flex'} flex={1} height={'100vh'}>
      <SideMenu />
      <Box
        component='main'
        display={'flex'}
        flexGrow={1}
        sx={{
          backgroundColor: theme => theme.palette.background.default,
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode='wait'>{children}</AnimatePresence>
      </Box>
    </Box>
  )
}
