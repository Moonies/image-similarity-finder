'use client'
import { useTranslation } from 'react-i18next'
import { Box } from '@mui/material'

export default function Home() {
  const { t } = useTranslation('common')

  return <Box>{t('welcome')}</Box>
}
