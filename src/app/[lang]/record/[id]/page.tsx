'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { Box, Button, TextField, Typography } from '@mui/material'
import TextFieldBox from '@/components/TextFieldBox'
import useEditRecord from './hooks/useEditRecord'

export default function RecordDetail({ params }: any) {
  const router = useRouter()
  const { handleChange, recordData } = useEditRecord()

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
          text='Drawing Number'
          value={recordData?.drawingNumber}
          onChange={e => handleChange('drawingNumber', e.target.value)}
        />
        <TextFieldBox
          text='Name'
          value={recordData?.name}
          onChange={e => handleChange('name', e.target.value)}
        />
        <TextFieldBox
          text='Material Cost'
          value={recordData?.materialCost}
          onChange={e => handleChange('materialCost', e.target.value)}
        />
        <TextFieldBox
          text='Material Supplier'
          value={recordData?.materialSup}
          onChange={e => handleChange('materialSup', e.target.value)}
        />
        <TextFieldBox
          text='Lathe Cost'
          value={recordData?.latheCost}
          onChange={e => handleChange('latheCost', e.target.value)}
        />
        <TextFieldBox
          text='Lathe Supplier'
          value={recordData?.latheSup}
          onChange={e => handleChange('latheSup', e.target.value)}
        />
        <TextFieldBox
          text='Milling Cost'
          value={recordData?.millingCost}
          onChange={e => handleChange('millingCost', e.target.value)}
        />
        <TextFieldBox
          text='Milling Supplier'
          value={recordData?.millingSup}
          onChange={e => handleChange('millingSup', e.target.value)}
        />
        <TextFieldBox
          text='Heat Treatment Cost'
          value={recordData?.heatTreatmentCost}
          onChange={e => handleChange('heatTreatmentCost', e.target.value)}
        />
        <TextFieldBox
          text='Heat Treatment Supplier'
          value={recordData?.heatTreatmentSup}
          onChange={e => handleChange('heatTreatmentSup', e.target.value)}
        />
        <TextFieldBox
          text='Grinding Cost'
          value={recordData?.grindingCost}
          onChange={e => handleChange('grindingCost', e.target.value)}
        />
        <TextFieldBox
          text='Grinding Supplier'
          value={recordData?.grindingSup}
          onChange={e => handleChange('grindingSup', e.target.value)}
        />
        <TextFieldBox
          text='Transportation Cost'
          value={recordData?.transportationCost}
          onChange={e => handleChange('transportationCost', e.target.value)}
        />
        <TextFieldBox
          text='Transportation Supplier'
          value={recordData?.transportationSup}
          onChange={e => handleChange('transportationSup', e.target.value)}
        />
        <TextFieldBox
          text='General Cost'
          value={recordData?.generalCost}
          onChange={e => handleChange('generalCost', e.target.value)}
        />
        <TextFieldBox
          text='General Supplier'
          value={recordData?.generalSup}
          onChange={e => handleChange('generalSup', e.target.value)}
        />
        <TextFieldBox
          text='Welding Cost'
          value={recordData?.weldingCost}
          onChange={e => handleChange('weldingCost', e.target.value)}
        />
        <TextFieldBox
          text='Welding Supplier'
          value={recordData?.weldingSup}
          onChange={e => handleChange('weldingSup', e.target.value)}
        />
        <TextFieldBox
          text='Other Cost'
          value={recordData?.otherCost}
          onChange={e => handleChange('otherCost', e.target.value)}
        />
        <TextFieldBox
          text='Other Supplier'
          value={recordData?.otherSup}
          onChange={e => handleChange('otherSup', e.target.value)}
        />
        <TextFieldBox
          text='Defect Details'
          value={recordData?.defectDetails}
          onChange={e => handleChange('defectDetails', e.target.value)}
        />
        <Button variant='contained' onClick={() => console.log(recordData)}>
          Save
        </Button>
      </Box>
    </Box>
  )
}
