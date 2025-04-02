'use client'

import {
  Box,
  Button,
  Card,
  CardActions,
  CardMedia,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import ImageViewerModal from '@/components/modals/ImageViewerModal'
import InformationForm from './components/InformationForm'
import { useTranslation } from 'react-i18next'
import { useCache } from '@/context/CacheContext'
import useSearchDetail from './hooks/useSearchDetail'
import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import Image from 'next/image'
import { DrawingImageDetail } from '@/api/drawing'
import PageTransition from '@/components/PageTransition'
import usePrint from '@/hooks/usePrint'

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

  const {
    handleGetDetailImage,
    handleUpdateDrawingDetail,
    imageUrls,
    metaData,
    isNewDrawing,
    setIsnewDrawing,
    processImage,
    handleAmountSearch,
  } = useSearchDetail()
  const [informationMode, setInformationMode] = useState<informationMode>('view')
  const { printFile } = usePrint()
  const [amountImage, setAmountImage] = useState(
    uploadCachedData ? uploadCachedData.uploadedAmount : 3
  )

  const listAmout = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

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
    async (formData?: UpdateDrawingImageDetail) => {
      console.log(selectedImage)
      switch (informationMode) {
        case 'add':
          if (formData) {
            const result = await handleUpdateDrawingDetail(formData)
            if (result) {
              setIsnewDrawing(false)
              setOpenInformation(false)
            }
          }
          break
        case 'view':
        default:
          printFile(selectedImage)
          break
      }
    },
    [handleUpdateDrawingDetail, informationMode, printFile, selectedImage, setIsnewDrawing]
  )

  // const processImage = useCallback(async () => {
  //   if (!cachedData?.length) return

  //   const newUrls = await Promise.all(
  //     cachedData
  //       .filter((_, index) => index !== cachedData.length - 1)
  //       .map(async (image, index, array) => {
  //         // if (index === array.length - 1) return
  //         const response: string = await getContentUrl(image.type, image.content)
  //         return {
  //           id: index,
  //           // url: image.type === 'image' ? URL.createObjectURL(image.content as Blob) : '',
  //           url: response,
  //           name: image.name.replace('files/', ''),
  //         }
  //       })
  //   )
  //   setImageUrls(newUrls)
  //   const metaData = cachedData[cachedData.length - 1].content as any
  //   const transformedContent: MetaData = Object.entries(metaData).reduce((acc, [key, value]) => {
  //     // Remove 'files/' from the key
  //     const newKey = key.replace('files/', '')
  //     return {
  //       ...acc,
  //       [newKey]: value,
  //     }
  //   }, {})

  //   setIsnewDrawing(metaData.newDrawing)
  //   setMetaData(transformedContent)
  //   setLoading(false)
  // }, [cachedData, getContentUrl, setLoading])

  useEffect(() => {
    if (!cachedData?.length) return
    processImage(cachedData)

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
            gap={2}
            // sx={{ backgroundColor: theme => theme.palette.primary.light }}
          >
            <Typography variant='h4' sx={{ color: theme => theme.palette.info.light }}>
              {t('similarTitle')}
            </Typography>
            <TextField
              select
              value={amountImage}
              size='small'
              sx={{ width: 180 }}
              label={t('amountLabel')}
              onChange={e => {
                setAmountImage(parseInt(e.target.value))
                handleAmountSearch(uploadCachedData?.uploadedFile, parseInt(e.target.value))
              }}
            >
              {listAmout.map(item => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </TextField>
          </Box>
          <Divider sx={{ marginX: 2, borderWidth: 1 }} />
          <Box
            display={'flex'}
            flexDirection={'row'}
            gap={2}
            padding={2}
            justifyContent={imageUrls.length <= 2 ? 'space-around' : 'flex-start'}
            sx={{
              width: '100%', // Ensure it spans the full width of the container
              whiteSpace: imageUrls.length > 2 ? 'nowrap' : 'normal', // Prevent cards from wrapping to the next row
            }}
            overflow={imageUrls.length > 2 ? 'auto' : 'visible'}
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
                        setInformationMode('view')
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
                        onClick={() => {
                          setSelectedImage(item.url)
                          handleOpenMoreInfo(item.name, 'view')
                        }}
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
