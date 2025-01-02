'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, TextField, Typography } from '@mui/material'
import TextFieldBox from '@/components/TextFieldBox'
import useEditRecord from './hooks/useEditRecord'
import { useTranslation } from 'react-i18next'

export default function RecordDetail({ params }: any) {
  const router = useRouter()
  const { handleChange, recordData } = useEditRecord()
  const { t } = useTranslation('record-id')

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
        image
      </Box>
      <Box
        display={'flex'}
        flexDirection={'column'}
        flex={1}
        padding={4}
        marginLeft={24}
        sx={{
          border: theme => `2px solid ${theme.palette.info.light}`,
          borderRadius: 2,
          background: theme => theme.palette.background.paper,
        }}
      >
        <TextFieldBox
          text={t('inputField1')}
          value={recordData?.drawingNumber}
          onChange={e => handleChange('drawingNumber', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField2')}
          value={recordData?.name}
          onChange={e => handleChange('name', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField3')}
          value={recordData?.materialCost}
          onChange={e => handleChange('materialCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField4')}
          value={recordData?.materialSup}
          onChange={e => handleChange('materialSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField5')}
          value={recordData?.latheCost}
          onChange={e => handleChange('latheCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField6')}
          value={recordData?.latheSup}
          onChange={e => handleChange('latheSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField7')}
          value={recordData?.millingCost}
          onChange={e => handleChange('millingCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField8')}
          value={recordData?.millingSup}
          onChange={e => handleChange('millingSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField9')}
          value={recordData?.heatTreatmentCost}
          onChange={e => handleChange('heatTreatmentCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField10')}
          value={recordData?.heatTreatmentSup}
          onChange={e => handleChange('heatTreatmentSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField11')}
          value={recordData?.grindingCost}
          onChange={e => handleChange('grindingCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField12')}
          value={recordData?.grindingSup}
          onChange={e => handleChange('grindingSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField13')}
          value={recordData?.transportationCost}
          onChange={e => handleChange('transportationCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField14')}
          value={recordData?.transportationSup}
          onChange={e => handleChange('transportationSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField15')}
          value={recordData?.generalCost}
          onChange={e => handleChange('generalCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField16')}
          value={recordData?.generalSup}
          onChange={e => handleChange('generalSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField17')}
          value={recordData?.weldingCost}
          onChange={e => handleChange('weldingCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField18')}
          value={recordData?.weldingSup}
          onChange={e => handleChange('weldingSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField19')}
          value={recordData?.otherCost}
          onChange={e => handleChange('otherCost', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField20')}
          value={recordData?.otherSup}
          onChange={e => handleChange('otherSup', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField21')}
          value={recordData?.sellingPrice}
          onChange={e => handleChange('sellingPrice', e.target.value)}
        />
        <TextFieldBox
          text={t('inputField22')}
          value={recordData?.defectDetails}
          onChange={e => handleChange('defectDetails', e.target.value)}
        />
        <Button variant='contained' onClick={() => console.log(recordData)}>
          {t('saveButton')}
        </Button>
      </Box>
    </Box>
  )
}
