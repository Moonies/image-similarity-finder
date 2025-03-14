'use client'
import { useTranslation } from 'react-i18next'
import { Box, Typography } from '@mui/material'
import PageTransition from '@/components/PageTransition'

export default function Home() {
  const { t } = useTranslation('common')
  console.log('HOST_IP:', process.env.HOST_IP)
  console.log('HOST_URL:', process.env.NEXT_PUBLIC_HOST_URL)
  return (
    <PageTransition>
      <Box p={2}>
        <Typography variant='h2'>{t('welcome')}</Typography>
        {/* <Typography variant='h2'>{t('welcome')}</Typography> */}
      </Box>
    </PageTransition>
  )
}
