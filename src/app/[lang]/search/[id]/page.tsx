'use client'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Typography,
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import image from '../mock/hataraku-image.jpg'
import TestLargeImage from '../mock/HAYARAKU-Data-Journey - Order Journey.jpg'
import ImageViewerModal from '@/components/modals/ImageViewerModal'
import InformationForm, { MockRecord } from './components/InformationForm'
import { useTranslation } from 'react-i18next'
export default function SearchDetail() {
  const { t } = useTranslation('search-id')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [openInformation, setOpenInformation] = useState(false)
  const mockArray = [TestLargeImage, image]

  const handleOpenMoreInfo = useCallback(() => {
    setOpenInformation(true)
  }, [])

  const handleSubmit = useCallback((formData: Partial<MockRecord> | undefined) => {}, [])

  return (
    <Box display={'flex'} flexDirection={'column'} flex={1}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        sx={{ backgroundColor: theme => theme.palette.background.paper }}
      >
        <Box
          display={'flex'}
          flexDirection={'row'}
          sx={{ backgroundColor: theme => theme.palette.background.paper }}
          padding={2}
        >
          <Typography variant='h4' sx={{ color: theme => theme.palette.info.light }}>
            {t('queryTitle')}
          </Typography>
        </Box>
        <Divider sx={{ marginX: 2, borderWidth: 1 }} />
        <Box display={'flex'} flex={1} flexDirection={'column'} alignItems={'center'} padding={2}>
          <Box maxWidth={1080} minWidth={720}>
            <img
              src={TestLargeImage.src}
              alt='Preview'
              style={{ maxWidth: '100%' }}
              onClick={e => {
                setSelectedImage(TestLargeImage.src)
                setModalOpen(true)
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        sx={{ backgroundColor: theme => theme.palette.background.paper }}
      >
        <Box
          display={'flex'}
          flexDirection={'row'}
          padding={2}
          // sx={{ backgroundColor: theme => theme.palette.primary.light }}
        >
          <Typography variant='h4' sx={{ color: theme => theme.palette.info.light }}>
            {t('similarTitle')}
          </Typography>
        </Box>
        <Divider sx={{ marginX: 2, borderWidth: 1 }} />
        <Box display={'flex'} flexDirection={'row'} gap={2} padding={2}>
          {mockArray.map((item, index) => {
            return (
              <Card key={index} sx={{ maxWidth: 345 }}>
                <CardMedia
                  component='img'
                  alt='green iguana'
                  height='345'
                  image={item.src}
                  onClick={e => {
                    setSelectedImage(item.src)
                    setModalOpen(true)
                  }}
                />
                <CardActions sx={{ justifyContent: 'space-between' }}>
                  <Button size='small' onClick={handleOpenMoreInfo} variant='contained'>
                    {t('infoButton')}
                  </Button>
                  {/* <Button size='small'>Learn More</Button> */}
                  <Typography variant='h6'>{t('similarPecent')} : 000%</Typography>
                </CardActions>
              </Card>
            )
          })}
        </Box>
      </Box>
      <InformationForm
        open={openInformation}
        onClose={() => setOpenInformation(false)}
        onSubmit={handleSubmit}
      />
      {modalOpen && (
        <ImageViewerModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          imagePreview={selectedImage}
        />
      )}
    </Box>
  )
}
