'use client'

import { Box, Button, Card, CardActions, CardMedia, Divider, Typography } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import ImageViewerModal from '@/components/modals/ImageViewerModal'
import InformationForm from './components/InformationForm'
import { useTranslation } from 'react-i18next'
import { useCache } from '@/context/CacheContext'
import useSearchDetail from './hooks/useSearchDetail'
import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import Image from 'next/image'
import { DrawingImageDetail } from '@/api/drawing'
import { useLoading } from '@/hooks/useLoading'
import PageTransition from '@/components/PageTransition'

type ImageUrl = {
  id: number
  url: string
  name: string
}
type MetaData = {
  [key: string]: number
} & {
  newDrawing?: boolean
}
type informationMode = 'add' | 'view'
export default function SearchDetail() {
  const { t } = useTranslation('search-id')
  const { getPageData } = useCache()
  const cachedData = getPageData('zipFile')
  const uploadCachedData = getPageData('rawData')
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [openInformation, setOpenInformation] = useState(false)
  const [selectedImageDetail, setSelectedImageDetail] = useState<Partial<DrawingImageDetail>>({})
  const [imageUrls, setImageUrls] = useState<ImageUrl[]>([])
  const [metaData, setMetaData] = useState<MetaData>()
  const [isNewDrawing, setIsnewDrawing] = useState(false)
  const { handleGetDetailImage, handleUpdateDrawingDetail } = useSearchDetail()
  const [informationMode, setInformationMode] = useState<informationMode>('view')
  const { setLoading } = useLoading()

  const handleOpenMoreInfo = useCallback(
    async (drawingNumber: string, mode: informationMode) => {
      const result = await handleGetDetailImage(drawingNumber)
      if (result) {
        setSelectedImageDetail(result)
        setInformationMode(mode)
        setOpenInformation(true)
      }
    },
    [handleGetDetailImage]
  )

  const handleSubmit = useCallback(
    async (formData: UpdateDrawingImageDetail) => {
      if (formData) {
        const result = await handleUpdateDrawingDetail(formData)
        if (result) {
          setIsnewDrawing(false)
          setOpenInformation(false)
        }
      }
    },
    [handleUpdateDrawingDetail]
  )

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
    setIsnewDrawing(metaData.newDrawing)
    setMetaData(transformedContent)
    setLoading(false)
    // Cleanup
    return () => {
      newUrls.forEach(image => {
        if (image.url) {
          URL.revokeObjectURL(image.url)
        }
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cachedData])

  const getFileValue = useCallback(
    (filename: string): number => {
      if (!metaData) return 0
      return metaData[filename] || 0
    },
    [metaData]
  )

  return (
    <PageTransition>
      <Box display={'flex'} flexDirection={'column'} flex={1} overflow={'auto'}>
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
            justifyContent={'space-between'}
          >
            <Box>
              <Typography variant='h4' sx={{ color: theme => theme.palette.info.light }}>
                {t('queryTitle')}
              </Typography>
            </Box>
            <Box display={'flex'}>
              {isNewDrawing && (
                <Button
                  // size='small'
                  onClick={() => handleOpenMoreInfo(uploadCachedData?.uploadedFileName, 'add')}
                  variant='contained'
                >
                  {t('addNewButton')}
                </Button>
              )}
            </Box>
          </Box>
          <Divider sx={{ marginX: 2, borderWidth: 1 }} />
          <Box display={'flex'} flex={1} flexDirection={'column'} alignItems={'center'} padding={2}>
            <Box>
              {uploadCachedData && (
                <Image
                  loader={({ src }) => src}
                  src={uploadCachedData.uploadedImage}
                  alt='Preview'
                  width={750} //Next Image can't auto width&height fill is oversize
                  height={500}
                  style={{ maxWidth: '100%' }}
                  unoptimized={true}
                  onClick={e => {
                    setSelectedImage(uploadCachedData.uploadedImage)
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
          <Box
            display={'flex'}
            flexDirection={'row'}
            gap={2}
            padding={2}
            justifyContent={'space-around'}
          >
            {imageUrls &&
              imageUrls.length > 0 &&
              imageUrls.map(item => {
                return (
                  <Card key={item.id} sx={{ minWidth: 345, maxWidth: 475 }}>
                    <CardMedia
                      component='img'
                      height={345}
                      // width={475}
                      image={item.url}
                      onClick={e => {
                        setSelectedImage(item.url)
                        setModalOpen(true)
                      }}
                      sx={{
                        objectFit: 'contain',
                      }}
                    />
                    <CardActions sx={{ justifyContent: 'space-between' }}>
                      <Button
                        size='small'
                        onClick={() => handleOpenMoreInfo(item.name, 'view')}
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

        <InformationForm
          open={openInformation}
          initialData={selectedImageDetail}
          onClose={() => setOpenInformation(false)}
          onSubmit={handleSubmit}
          mode={informationMode}
        />

        {modalOpen && (
          <ImageViewerModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            imagePreview={selectedImage}
          />
        )}
      </Box>
    </PageTransition>
  )
}
