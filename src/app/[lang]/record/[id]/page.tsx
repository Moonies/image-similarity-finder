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

export default function RecordDetail() {
  const router = useRouter()
  const { getPageData } = useCache()
  const isFirstMount = useRef(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const { withLoading, setLoading } = useLoading()
  const { handleChange, recordData, getDrawingImage, drawingImage, handleUpdateDrawingDetail } =
    useEditRecord(getPageData('rawData') as DrawingImageDetail)
  const { t } = useTranslation('record-id')

  useEffect(() => {
    if (isFirstMount.current) {
      const cachedData = getPageData('rawData')
      if (cachedData) withLoading(getDrawingImage(cachedData[`drawingNumber`]))
      isFirstMount.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSaveClick = useCallback(async () => {
    const response = await handleUpdateDrawingDetail(recordData)
    if (response) {
      setLoading(false)
      router.back()
    }
  }, [handleUpdateDrawingDetail, recordData, router, setLoading])

  return (
    <Box display={'flex'} flex={1} padding={1}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        alignContent={'center'}
        justifyContent={'center'}
        textAlign={'center'}
        sx={{
          borderRadius: 2,
          background: theme => theme.palette.background.paper,
        }}
      >
        <Box>
          {drawingImage && (
            <Image
              loader={({ src }) => src}
              src={drawingImage}
              alt='Preview'
              width={750} //Next Image can't auto width&height fill is oversize
              height={500}
              style={{ height: 'auto' }}
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
        padding={4}
        marginLeft={8}
        sx={{
          border: theme => `2px solid ${theme.palette.info.light}`,
          borderRadius: 2,
          background: theme => theme.palette.background.paper,
        }}
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
        <Button variant='contained' onClick={handleSaveClick}>
          {t('saveButton')}
        </Button>
      </Box>
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
