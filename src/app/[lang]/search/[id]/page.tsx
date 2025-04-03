'use client'

import {
  Box,
  Button,
  Card,
  CardActions,
  Divider,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { useCallback, useEffect, useState } from 'react'
import InformationForm from './components/InformationForm'
import { useTranslation } from 'react-i18next'
import { useCache } from '@/context/CacheContext'
import useSearchDetail from './hooks/useSearchDetail'
import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import { DrawingImageDetail } from '@/api/drawing'
import PageTransition from '@/components/PageTransition'
import usePrint from '@/hooks/usePrint'
import ImageViewer from '@/components/ImageViewer'
import { getCurrentAmountSearch } from '@/store/slices/userSettingSlice'

type informationMode = 'add' | 'view'
export default function SearchDetail() {
  const { t } = useTranslation('search-id')
  const { getPageData } = useCache()
  const cachedData = getPageData('zipFile')
  const uploadCachedData = getPageData('rawData')
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
    totalResult,
  } = useSearchDetail()
  const [informationMode, setInformationMode] = useState<informationMode>('view')
  const { printFile } = usePrint()
  const [amountImage, setAmountImage] = useState(getCurrentAmountSearch() ?? 3)

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
                <ImageViewer
                  imageUrl={uploadCachedData.uploadedImage}
                  width={750} //Next Image can't auto width&height fill is oversize
                  height={500}
                  style={{ height: '100%' }}
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
            <Typography alignContent={'flex-end'} fontWeight={600}>
              {t('amountResult')}
              {totalResult}
            </Typography>
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
                    {/* <CardMedia
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
                    /> */}
                    <ImageViewer imageUrl={item.url} height={345} cardMedia={true} />
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
      </Box>
    </PageTransition>
  )
}
