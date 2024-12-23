'use client'

import { useThemeContext } from '@/context/ThemeContext'
import { useConfirmModal } from '@/hooks/useConfirm'
import useHttp from '@/hooks/useHttp'
import { Box, Button, Typography } from '@mui/material'
import { useEffect } from 'react'

export default function ViewerPage() {
  const { api } = useHttp()
  const { openConfirmModal } = useConfirmModal()

  //for example
  const testApi = async () => {
    const result = await api.user.checkAuth('aaaa', 'bbbb')
    console.log(result)
  }

  useEffect(() => {
    testApi()
  }, [])
  return (
    <Box>
      <Typography variant='h4'>Viewer Page</Typography>
      <Typography>Viewer content goes here</Typography>
      <Button
        onClick={async () => {
          //for example
          const confirmed = await openConfirmModal({
            title: '確認してください',
            message:
              'ログアウトを確認します \n ログアウトはプログラムを閉じたり終了したりしませ。\n ご注意してください。',
          })
          if (confirmed) {
            console.log('confirmed')
          }
        }}
      >
        Click
      </Button>
    </Box>
  )
}
