'use client'

import { Box, Button, Card, CardActions, CardMedia, Divider, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import ImageViewerModal from '@/components/modals/ImageViewerModal'
import InformationForm from './components/InformationForm'
import { useTranslation } from 'react-i18next'
import { useCache } from '@/context/CacheContext'
import useSearchDetail from './hooks/useSearchDetail'
import { DrawingImageDetail } from '@/api/drawing/getDrawingDetail'
import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'

type ImageUrl = {
  id: number
  url: string
  name: string
}
type MetaData = {
  [key: string]: number
}
export default function SearchDetail() {
  const { t } = useTranslation('search-id')
  const { getPageData } = useCache()
  const cachedData = getPageData('zipFile')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [openInformation, setOpenInformation] = useState(false)
  const [selectedImageDetail, setSelectedImageDetail] = useState<Partial<DrawingImageDetail>>({})
  const [imageUrls, setImageUrls] = useState<ImageUrl[]>([])
  const [metaData, setMetaData] = useState<MetaData>()
  const { handleGetDetailImage, handleUpdateDrawingDetail } = useSearchDetail()

  const handleOpenMoreInfo = useCallback(async (drawingNumber: string) => {
    const result = await handleGetDetailImage(drawingNumber)
    if (result) {
      setSelectedImageDetail(result)
      setOpenInformation(true)
    }
  }, [])

  const handleSubmit = useCallback(async (formData: UpdateDrawingImageDetail) => {
    if (formData) {
      const result = await handleUpdateDrawingDetail(formData)
      if (result) setOpenInformation(false)
    }
  }, [])

  useEffect(() => {
    if (!cachedData?.length) return
    const newUrls = cachedData
      .filter((_, index) => index !== cachedData.length - 1)
      .map((image, index, array) => {
        // if (index === array.length - 1) return
        return {
          id: index,
          url: image.type === 'image' ? URL.createObjectURL(image.content as Blob) : '',
          name: image.name.replace('files/', ''),
        }
      })
    setImageUrls(newUrls)
    const metaData = cachedData[cachedData.length - 1].content as any
    const transformedContent: MetaData = Object.entries(metaData).reduce((acc, [key, value]) => {
      // Remove 'files/' from the key
      const newKey = key.replace('files/', '')
      return {
        ...acc,
        [newKey]: value,
      }
    }, {})
    setMetaData(transformedContent)
    // Cleanup
    return () => {
      newUrls.forEach(image => {
        if (image.url) {
          URL.revokeObjectURL(image.url)
        }
      })
    }
  }, [cachedData])

  const getFileValue = useCallback((filename: string): number => {
    if (!metaData) return 0
    return metaData[filename] || 0
  }, [])

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
            {imageUrls && imageUrls.length > 0 && (
              <img
                src={imageUrls[0].url}
                alt='Preview'
                style={{ maxWidth: '100%' }}
                onClick={e => {
                  setSelectedImage(imageUrls[0].url)
                  setModalOpen(true)
                }}
              />
            )}
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
          {imageUrls &&
            imageUrls.length > 0 &&
            imageUrls.map(item => {
              return (
                <Card key={item.id}>
                  <CardMedia
                    component='img'
                    // alt='green iguana'
                    height='345'
                    image={item.url}
                    onClick={e => {
                      setSelectedImage(item.url)
                      setModalOpen(true)
                    }}
                  />
                  <CardActions sx={{ justifyContent: 'space-between' }}>
                    <Button
                      size='small'
                      onClick={() => handleOpenMoreInfo(item.name)}
                      variant='contained'
                    >
                      {t('infoButton')}
                    </Button>
                    <Typography variant='h6'>
                      {t('similarPecent')} : {getFileValue(item.name)}%
                    </Typography>
                  </CardActions>
                </Card>
              )
            })}
        </Box>
      </Box>
      {openInformation && (
        <InformationForm
          open={openInformation}
          initialData={selectedImageDetail}
          onClose={() => setOpenInformation(false)}
          onSubmit={handleSubmit}
        />
      )}
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
