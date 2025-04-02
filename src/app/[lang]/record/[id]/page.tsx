'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button } from '@mui/material'
import TextFieldBox from '@/components/TextFieldBox'
import useEditRecord from './hooks/useEditRecord'

import { useTranslation } from 'react-i18next'
import { useCache } from '@/context/CacheContext'
import { DrawingImageDetail } from '@/api/drawing'
import Image from 'next/image'
import ImageViewerModal from '@/components/modals/ImageViewerModal'
import { useLoading } from '@/hooks/useLoading'
import PageTransition from '@/components/PageTransition'
import { convertTifToBlob } from '@/utils/fileConvert'
import { useNotification } from '@/hooks/useNotification'

export default function RecordDetail() {
  const router = useRouter()
  const { getPageData } = useCache()
  const isFirstMount = useRef(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const { withLoading, setLoading } = useLoading()
  const [newImageUpload, setNewImageUpload] = useState<File>()
  const { notificationSnackbar } = useNotification()
  const {
    handleChange,
    recordData,
    getDrawingImage,
    drawingImage,
    setDrawingImage,
    handleUpdateDrawing,
  } = useEditRecord(getPageData('rawData') as DrawingImageDetail)
  const { t } = useTranslation('record-id')

  useEffect(() => {
    if (isFirstMount.current) {
      const cachedData = getPageData('rawData')
      if (cachedData) withLoading(getDrawingImage(cachedData[`id`]))
      isFirstMount.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveClick = useCallback(async () => {
    // const response = await handleUpdateDrawingDetail(recordData)
    setLoading(true)
    const response = await handleUpdateDrawing(recordData, newImageUpload)
    if (response) {
      setLoading(false)
      router.back()
    }
  }, [handleUpdateDrawing, newImageUpload, recordData, router, setLoading])

  const handleUpdateNewImage = useCallback(
    async (newImage: File) => {
      setNewImageUpload(newImage)
      if (newImage.type === 'image/tiff' || newImage.type === 'image/tif') {
        const tifBlob = await convertTifToBlob(newImage)
        if (!tifBlob) {
          notificationSnackbar.error('convert tif file failed')
          return
        }
        const uploadedFile = URL.createObjectURL(tifBlob)
        setTimeout(() => {
          setDrawingImage(uploadedFile)
          setLoading(false)
        }, 1000)
      } else {
        const uploadedFile = URL.createObjectURL(newImage)
        setTimeout(() => {
          setDrawingImage(uploadedFile)
          setLoading(false)
        }, 1000)
      }
    },
    [notificationSnackbar, setDrawingImage, setLoading]
  )

  return (
    <PageTransition>
      <Box display={'flex'} flex={1} padding={1} height={'100%'}>
        <Box
          display={'flex'}
          flexDirection={'column'}
          flex={1}
          alignContent={'center'}
          justifyContent={'space-around'}
          textAlign={'center'}
          padding={1}
          sx={{
            borderRadius: 2,
            background: theme => theme.palette.background.paper,
          }}
        >
          {/* <Box display={'flex'} justifyContent={'flex-end'} margin={2}>
            <IconButton
              edge='end'
              color='inherit'
              // onClick={handleZoomIn}
              aria-label='Upload'
            >
              <EditIcon />
            </IconButton>
          </Box> */}
          <Box
            display={'flex'}
            justifyContent={'center'}
            alignContent={'center'}
            textAlign={'center'}
          >
            {drawingImage && (
              <Image
                loader={({ src }) => src}
                src={drawingImage}
                alt='Preview'
                width={750} //Next Image can't auto width&height fill is oversize
                height={500}
                className='w-full h-auto'
                onClick={e => {
                  setSelectedImage(drawingImage)
                  setModalOpen(true)
                }}
              />
            )}
          </Box>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          flex={1}
          marginLeft={8}
          height={'100%'}
          sx={{
            border: theme => `2px solid ${theme.palette.info.light}`,
            borderRadius: 2,
            background: theme => theme.palette.background.paper,
          }}
        >
          <Box
            display={'flex'}
            flexDirection={'column'}
            flexShrink={1}
            paddingX={4}
            paddingTop={2}
            sx={{ overflowY: 'auto' }}
          >
            <TextFieldBox
              text={t('inputField1')}
              value={recordData?.drawingNumber ?? ''}
              onChange={e => handleChange('drawingNumber', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField2')}
              value={recordData?.name ?? ''}
              onChange={e => handleChange('name', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField3')}
              value={recordData?.materialCost ?? ''}
              onChange={e => handleChange('materialCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField4')}
              value={recordData?.materialSup ?? ''}
              onChange={e => handleChange('materialSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField5')}
              value={recordData?.latheCost ?? ''}
              onChange={e => handleChange('latheCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField6')}
              value={recordData?.latheSup ?? ''}
              onChange={e => handleChange('latheSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField7')}
              value={recordData?.millingCost ?? ''}
              onChange={e => handleChange('millingCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField8')}
              value={recordData?.millingSup ?? ''}
              onChange={e => handleChange('millingSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField9')}
              value={recordData?.heatTreatmentCost ?? ''}
              onChange={e => handleChange('heatTreatmentCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField10')}
              value={recordData?.heatTreatmentSup ?? ''}
              onChange={e => handleChange('heatTreatmentSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField11')}
              value={recordData?.grindingCost ?? ''}
              onChange={e => handleChange('grindingCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField12')}
              value={recordData?.grindingSup ?? ''}
              onChange={e => handleChange('grindingSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField13')}
              value={recordData?.transportationCost ?? ''}
              onChange={e => handleChange('transportationCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField14')}
              value={recordData?.transportationSup ?? ''}
              onChange={e => handleChange('transportationSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField15')}
              value={recordData?.generalCost ?? ''}
              onChange={e => handleChange('generalCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField16')}
              value={recordData?.generalSup ?? ''}
              onChange={e => handleChange('generalSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField17')}
              value={recordData?.weldingCost ?? ''}
              onChange={e => handleChange('weldingCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField18')}
              value={recordData?.weldingSup ?? ''}
              onChange={e => handleChange('weldingSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField19')}
              value={recordData?.otherCost ?? ''}
              onChange={e => handleChange('otherCost', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField20')}
              value={recordData?.otherSup ?? ''}
              onChange={e => handleChange('otherSup', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField21')}
              value={recordData?.sellingPrice ?? ''}
              onChange={e => handleChange('sellingPrice', e.target.value)}
            />
            <TextFieldBox
              text={t('inputField22')}
              value={recordData?.defectDetails ?? ''}
              onChange={e => handleChange('defectDetails', e.target.value)}
            />
          </Box>
          <Box display={'flex'} flexDirection={'column'} flex={1}>
            <Button variant='contained' onClick={handleSaveClick}>
              {t('saveButton')}
            </Button>
          </Box>
        </Box>
        {modalOpen && (
          <ImageViewerModal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            imagePreview={selectedImage}
            editable={true}
            onUpdate={handleUpdateNewImage}
          />
        )}
      </Box>
    </PageTransition>
  )
}
