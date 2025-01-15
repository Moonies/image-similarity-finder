'use client'

import InputUploadFile from '@/components/InputUploadFile'
import { Box, Button, Typography } from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSearch from './hooks/useSearch'
import { useNotification } from '@/hooks/useNotification'

export default function SearchPage() {
  const { t } = useTranslation('search-page')
  const [uploadFile, setUploadFile] = useState<File>()
  const { handleUpload } = useSearch()
  const { notificationModal } = useNotification()

  const handleChooseFile = useCallback(
    (chooseFile: FileList | null) => {
      const file = chooseFile?.[0]
      //something event
      setUploadFile(file)
    },
    [setUploadFile]
  )

  const handleSubmit = useCallback(() => {
    if (uploadFile) {
      handleUpload(uploadFile)
    } else {
      notificationModal.warning('Please Select file after click button.')
    }
  }, [handleUpload, notificationModal, uploadFile])

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
          <Button variant='contained' onClick={handleSubmit}>
            {t('submitButton')}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
