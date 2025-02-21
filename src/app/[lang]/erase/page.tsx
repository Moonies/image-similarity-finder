'use client'

import InputUploadFile from '@/components/InputUploadFile'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCanvas } from './hooks/useCanvas'
import useEraser from './hooks/useErase'
import { useLoading } from '@/hooks/useLoading'
import { default as NextImage } from 'next/image'
import { clearPredictorId } from '@/store/slices/eraseSlice'
import { useAppDispatch } from '@/hooks/useRedux'
import { useNotification } from '@/hooks/useNotification'
import { useConfirmModal } from '@/hooks/useConfirm'

export interface Point {
  point: [number, number]
  label: number
}

export interface Box {
  x: number
  y: number
  width: number
  height: number
}

export default function ErasePage() {
  const { t } = useTranslation('erase-page')
  // const [uploadFile, setUploadFile] = useState<File>()
  const buttonUploadRef = useRef<HTMLInputElement>(null)
  const { setLoading } = useLoading()

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [erasedDrawing, setErasedDrawing] = useState<string>()
  const [canvasDimension, setCanvasDimension] = useState({ width: 0, height: 0 })
  const [points, setPoints] = useState<Point[]>([])
  const [boxes, setBoxes] = useState<Box[]>([])
  const [actions, setActions] = useState<number>(0)
  const { notificationModal } = useNotification()
  const { openConfirmModal } = useConfirmModal()

  const dispatch = useAppDispatch()

  const {
    boxSelectionMode,
    drawingMode,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    redrawCanvas,
    setBoxSelectionMode,
    setDrawingMode,
  } = useCanvas(
    canvasRef,
    maskCanvasRef,
    points,
    boxes,
    originalImage,
    setPoints,
    setBoxes,
    setActions,
    setOriginalImage
  )

  const { addEraseDrawing, undoEraserDrawing, processEraserDrawing } = useEraser()

  const handleProcessImage = async () => {
    const result = await processEraserDrawing()
    if (!result) return
    setErasedDrawing(result)
  }

  const handleUndo = async () => {
    setLoading(true)
    const result = await undoEraserDrawing()
    if (result) {
      const img = new Image()
      img.src = result
      img.onload = () => setOriginalImage(img)
      setActions(prevActions => prevActions - 1)
      setLoading(false)
    }
  }

  const handleReset = async () => {
    if (!originalImage) {
      notificationModal.warning('Application is already in the initial state.')
      return
    }

    const confirmed = await openConfirmModal({
      title: 'confirm',
      message: 'Are you sure you want to reset the application? All actions will be lost.',
    })
    if (confirmed) {
    }
  }

  const handleChooseFile = useCallback(
    async (chooseFile: FileList | null) => {
      const file = chooseFile?.[0]
      if (file) {
        setLoading(true)
        const result = await addEraseDrawing(file)
        if (result) {
          setCanvasDimension({ width: result?.width, height: result?.height })
          const img = new Image()
          img.src = result.drawingFile
          img.onload = () => setOriginalImage(img)
          setLoading(false)
        }
      }
    },
    [addEraseDrawing, setLoading]
  )

  // const convertToBase64 = (file: File): Promise<string> => {
  //   return new Promise((resolve, reject) => {
  //     const fileReader = new FileReader()
  //     fileReader.readAsDataURL(file)

  //     fileReader.onload = () => {
  //       resolve(fileReader.result as string)
  //     }

  //     fileReader.onerror = error => {
  //       reject(error)
  //     }
  //   })
  // }

  useEffect(() => {
    redrawCanvas()
  }, [boxes, redrawCanvas])

  useEffect(() => {
    dispatch(clearPredictorId())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box display={'flex'} flexDirection={'column'} padding={1} flex={1}>
      <Box display={'flex'} flexDirection={'row'} gap={2}>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <InputUploadFile onChoose={files => handleChooseFile(files)} ref={buttonUploadRef} />
          {/* <Typography alignContent={'center'}>
            {uploadFile ? uploadFile.name : t('imagePlaceholder')}
          </Typography> */}
        </Box>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          <Button variant='contained' onClick={handleProcessImage} disabled={actions === 0}>
            {t('processButton')}
          </Button>
          <Button variant='contained'> {t('printButton')}</Button>
          <Button variant='contained' onClick={handleUndo} disabled={actions === 0}>
            {t('undoButton')}
          </Button>
          <Button variant='contained' onClick={handleReset}>
            {t('resetButton')}
          </Button>
          <Button
            variant='contained'
            onClick={() => setDrawingMode(!drawingMode)}
            disabled={boxSelectionMode}
          >
            {drawingMode ? t('stopDrawingButton') : t('drawingButton')}
          </Button>
          <Button
            variant='contained'
            onClick={() => setBoxSelectionMode(!boxSelectionMode)}
            disabled={drawingMode}
          >
            {boxSelectionMode ? t('stopDrawBoxButton') : t('drawBoxButton')}
          </Button>
        </Box>
      </Box>
      <Box overflow={'auto'} padding={2}>
        {canvasDimension.width > 0 && canvasDimension.height > 0 && (
          <Box
            display={'flex'}
            flex={1}
            flexDirection={'column'}
            width={`${canvasDimension.width}px`}
            height={`${canvasDimension.height}px`}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              style={{ cursor: 'crosshair' }}
              height={canvasDimension.height}
              width={canvasDimension.width}
            />
            <canvas
              ref={maskCanvasRef}
              style={{ display: 'none' }}
              height={canvasDimension.height}
              width={canvasDimension.width}
            />
          </Box>
        )}
        {erasedDrawing && (
          <Box display={'flex'} flexDirection={'column'} flex={1} marginTop={4}>
            <Box display={'flex'} flex={1}>
              <Typography variant='h3'>Processed Image</Typography>
            </Box>
            <NextImage
              loader={({ src }) => src}
              src={erasedDrawing}
              alt='Preview'
              height={canvasDimension.height}
              width={canvasDimension.width}
              // style={{ maxWidth: '100%' }}
              unoptimized={true}
              onClick={e => {
                // setSelectedImage(uploadCachedData.uploadedImage)
                // setModalOpen(true)
              }}
            />
          </Box>
        )}
      </Box>
    </Box>
  )
}
