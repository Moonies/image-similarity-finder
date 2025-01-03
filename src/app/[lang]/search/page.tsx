'use client'

import InputUploadFile from '@/components/InputUploadFile'
import { Box, Button, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function SearchPage() {
  const { t } = useTranslation('search-page')
  const [uploadFile, setUploadFile] = useState<File>()

  const handleChooseFile = useCallback(
    (chooseFile: FileList | null) => {
      const file = chooseFile?.[0]
      //something event
      setUploadFile(file)
    },
    [setUploadFile]
  )

  const handleUpload = () => {}

  return (
    <Box display={'flex'} flex={1} flexDirection={'column'} padding={1}>
      <Box
        flexDirection={'row'}
        display={'flex'}
        gap={2}
        padding={2}
        sx={{ backgroundColor: '#b9b8b8' }}
      >
        <Typography>{t('title')}</Typography>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        gap={2}
        padding={2}
        sx={{ backgroundColor: theme => theme.palette.background.paper }}
      >
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <InputUploadFile onChoose={files => handleChooseFile(files)} />
          <Typography>{uploadFile ? uploadFile.name : t('imagePlaceholder')}</Typography>
        </Box>
        <Box display={'flex'} flexDirection={'row'}>
          <Button variant='contained'>{t('submitButton')}</Button>
        </Box>
      </Box>
    </Box>
  )
}
