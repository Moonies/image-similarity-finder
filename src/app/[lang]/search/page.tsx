'use client'

import InputUploadFile from '@/components/InputUploadFile'
import { Box, Button, MenuItem, TextField, Typography } from '@mui/material'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useSearch from './hooks/useSearch'
import { useNotification } from '@/hooks/useNotification'
import PageTransition from '@/components/PageTransition'
import { getCurrentAmountSearch } from '@/store/slices/userSettingSlice'

export default function SearchPage() {
  const { t } = useTranslation('search-page')
  const [uploadFile, setUploadFile] = useState<File>()
  const [amountImage, setAmountImage] = useState(getCurrentAmountSearch() ?? 3)
  const { handleUpload, handleAmountSearch } = useSearch()
  const { notificationModal } = useNotification()
  const buttonUploadRef = useRef<HTMLInputElement>(null)
  const listAmout = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] //maximum is 10

  useEffect(() => {
    buttonUploadRef.current?.click()
    return () => {}
  }, [])

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
      handleUpload(uploadFile, amountImage)
    } else {
      notificationModal.warning(t('alertUploadFile'))
    }
  }, [amountImage, handleUpload, notificationModal, t, uploadFile])

  return (
    <PageTransition>
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
            <InputUploadFile onChoose={files => handleChooseFile(files)} ref={buttonUploadRef} />
            <Typography>{uploadFile ? uploadFile.name : t('imagePlaceholder')}</Typography>
          </Box>
          <Box display={'flex'} flexDirection={'row'} gap={2}>
            <Box>
              <TextField
                select
                value={amountImage}
                size='small'
                sx={{ width: 180 }}
                label={t('amountLabel')}
                onChange={e => {
                  setAmountImage(parseInt(e.target.value))
                  handleAmountSearch(parseInt(e.target.value))
                }}
              >
                {listAmout.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box justifyContent={'center'} alignContent={'center'}>
              <Button variant='contained' onClick={handleSubmit}>
                {t('submitButton')}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </PageTransition>
  )
}
