'use client'

import React, { useEffect, useState } from 'react'
import { Drawer, Box, IconButton, Typography, Button } from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import TextFieldBox from '@/components/TextFieldBox'
import { useTranslation } from 'react-i18next'
import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import { DrawingImageDetail } from '@/api/drawing'

interface InformationFormProps {
  open: boolean
  initialData: Partial<DrawingImageDetail>
  onClose: () => void
  onSubmit: (formData?: UpdateDrawingImageDetail) => void
  mode?: 'add' | 'view'
}

export default function InformationForm({
  onClose,
  onSubmit,
  open,
  initialData,
  mode = 'view',
}: InformationFormProps) {
  const { t } = useTranslation('search-id-information')
  const [recordData, setRecordData] = useState<Partial<DrawingImageDetail>>()

  const handleChange = (name: keyof DrawingImageDetail, value: string | number | null) => {
    setRecordData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = () => {
    if (mode === 'add') {
      //somthing add
      onSubmit(recordData as UpdateDrawingImageDetail)
    } else {
      //print on view mode
      onSubmit()
    }
  }

  useEffect(() => {
    setRecordData(initialData)

    return () => {}
  }, [initialData])
  return (
    <Drawer
      anchor={'right'}
      open={open}
      onClose={(event, reason) => {
        if (mode !== 'add') {
          onClose()
        }
      }}
      disableEscapeKeyDown={true}
      sx={{
        '& .MuiDrawer-paper': {
          width: '40%',
        },
      }}
    >
      <Box display={'flex'} flex={1} flexDirection={'column'} gap={2} height={'100%'}>
        <Box display={'flex'} justifyContent={'space-between'} padding={2}>
          <Typography variant='h4'>{t('title')}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'column'}
          flexShrink={1}
          paddingX={4}
          sx={{ overflowY: 'auto' }}
        >
          <TextFieldBox
            id='inputField-drawingNumber'
            text={t('inputField1')}
            value={recordData?.drawingNumber ?? ''}
            onChange={e => handleChange('drawingNumber', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-name'
            text={t('inputField2')}
            value={recordData?.name ?? ''}
            onChange={e => handleChange('name', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-materialCost'
            text={t('inputField3')}
            value={recordData?.materialCost ?? ''}
            onChange={e => handleChange('materialCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-materialSup'
            text={t('inputField4')}
            value={recordData?.materialSup ?? ''}
            onChange={e => handleChange('materialSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-latheCost'
            text={t('inputField5')}
            value={recordData?.latheCost ?? ''}
            onChange={e => handleChange('latheCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-latheSup'
            text={t('inputField6')}
            value={recordData?.latheSup ?? ''}
            onChange={e => handleChange('latheSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-millingCost'
            text={t('inputField7')}
            value={recordData?.millingCost ?? ''}
            onChange={e => handleChange('millingCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-millingSup'
            text={t('inputField8')}
            value={recordData?.millingSup ?? ''}
            onChange={e => handleChange('millingSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-heatTreatmentCost'
            text={t('inputField9')}
            value={recordData?.heatTreatmentCost ?? ''}
            onChange={e => handleChange('heatTreatmentCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-heatTreatmentSup'
            text={t('inputField10')}
            value={recordData?.heatTreatmentSup ?? ''}
            onChange={e => handleChange('heatTreatmentSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-grindingCost'
            text={t('inputField11')}
            value={recordData?.grindingCost ?? ''}
            onChange={e => handleChange('grindingCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-grindingSup'
            text={t('inputField12')}
            value={recordData?.grindingSup ?? ''}
            onChange={e => handleChange('grindingSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-transportationCost'
            text={t('inputField13')}
            value={recordData?.transportationCost ?? ''}
            onChange={e => handleChange('transportationCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-transportationSup'
            text={t('inputField14')}
            value={recordData?.transportationSup ?? ''}
            onChange={e => handleChange('transportationSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-generalCost'
            text={t('inputField15')}
            value={recordData?.generalCost ?? ''}
            onChange={e => handleChange('generalCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-generalSup'
            text={t('inputField16')}
            value={recordData?.generalSup ?? ''}
            onChange={e => handleChange('generalSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-weldingCost'
            text={t('inputField17')}
            value={recordData?.weldingCost ?? ''}
            onChange={e => handleChange('weldingCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-weldingSup'
            text={t('inputField18')}
            value={recordData?.weldingSup ?? ''}
            onChange={e => handleChange('weldingSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-otherCost'
            text={t('inputField19')}
            value={recordData?.otherCost ?? ''}
            onChange={e => handleChange('otherCost', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-otherSup'
            text={t('inputField20')}
            value={recordData?.otherSup ?? ''}
            onChange={e => handleChange('otherSup', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-sellingPrice'
            text={t('inputField21')}
            value={recordData?.sellingPrice ?? ''}
            onChange={e => handleChange('sellingPrice', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
          <TextFieldBox
            id='inputField-defectDetails'
            text={t('inputField22')}
            value={recordData?.defectDetails ?? ''}
            onChange={e => handleChange('defectDetails', e.target.value)}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
          />
        </Box>
        <Box display={'flex'} flexDirection={'column'} flex={1}>
          <Button variant='contained' onClick={handleSubmit}>
            {mode === 'add' ? t('saveButton') : t('printButton')}
          </Button>
        </Box>
      </Box>
    </Drawer>
  )
}
