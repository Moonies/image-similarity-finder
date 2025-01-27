'use client'

import { Button, styled } from '@mui/material'
import React, { RefObject } from 'react'
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

type InputUploadFileProps = {
  onChoose: (file: FileList | null) => void
  ref: RefObject<HTMLInputElement>
}

export default function InputUploadFile({ onChoose, ref }: InputUploadFileProps) {
  const { t } = useTranslation('common')

  return (
    <Button
      component='label'
      role={undefined}
      variant='contained'
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      {t('inputUploadFile')}
      <VisuallyHiddenInput type='file' onChange={event => onChoose(event.target.files)} ref={ref} />
    </Button>
  )
}
