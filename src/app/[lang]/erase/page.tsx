'use client'

import InputUploadFile from '@/components/InputUploadFile'
import { Box, Button, Typography } from '@mui/material'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useCanvas } from './hooks/useCanvas'
import useEraser from './hooks/useErase'
import { useLoading } from '@/hooks/useLoading'
import { default as NextImage } from 'next/image'
import { clearPredictorId, clearFileDetail } from '@/store/slices/eraseSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux'
import { useNotification } from '@/hooks/useNotification'
import { useConfirmModal } from '@/hooks/useConfirm'
import AddNewDrawingModal from '@/components/modals/AddNewDrawingModal'
import PageTransition from '@/components/PageTransition'

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
  const [currentProceesedFile, setCurrentProcessedFile] = useState<File>()
  const { fileName } = useAppSelector(state => state.erase)
  const [openModalAddNewDrawing, setOpenModalAddNewDrawing] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement>(null)
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [erasedDrawing, setErasedDrawing] = useState<string>()
  const [canvasDimension, setCanvasDimension] = useState({ width: 0, height: 0 })
  const [points, setPoints] = useState<Point[]>([])
  const [boxes, setBoxes] = useState<Box[]>([])
  const [actions, setActions] = useState<number>(0)
  const { notificationModal, notificationSnackbar } = useNotification()
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

  const {
    addEraseDrawing,
    undoEraserDrawing,
    processEraserDrawing,
    resetEraserDrawing,
    updateEraserDrawingImage,
    addNewDrawing,
  } = useEraser()

  const handleProcessImage = async () => {
    const result = await processEraserDrawing()
    if (!result) return
    const file = new File([result], fileName, { type: result.type })
    // console.log(file)
    setCurrentProcessedFile(file)
    setErasedDrawing(URL.createObjectURL(result))
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
      notificationModal.warning(t('alertNonUpload'))
      return
    }

    const confirmed = await openConfirmModal({
      title: t('titleConfirmModal'),
      message: t('resetMessage'),
    })
    if (confirmed) {
      const result = await resetEraserDrawing()
      if (result) {
        setOriginalImage(null)
        setErasedDrawing(undefined)
        setCanvasDimension({ width: 0, height: 0 })
        setActions(0)
        setBoxSelectionMode(false)
        setDrawingMode(false)
        dispatch(clearPredictorId())
      }
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
        if (buttonUploadRef.current) {
          buttonUploadRef.current.value = ''
        }
      }
    },
    [addEraseDrawing, setLoading]
  )

  const handleSave = useCallback(async () => {
    const confirmed = await openConfirmModal({
      title: t('titleConfirmModal'),
      message: t('saveMessage'),
    })
    if (confirmed && currentProceesedFile) {
      const result = await updateEraserDrawingImage(currentProceesedFile)
      // console.log(result)
      if (result.code === 404) {
        const confirmed = await openConfirmModal({
          title: t('titleConfirmModal'),
          message: t('alertAddNewDrawing'),
        })
        if (confirmed) {
          const response = await addNewDrawing(currentProceesedFile)
          if (response) {
            notificationSnackbar.success(t('addNewDrawingMessageSuccess'))
          }
        }
      }
    }
  }, [
    addNewDrawing,
    currentProceesedFile,
    notificationSnackbar,
    openConfirmModal,
    t,
    updateEraserDrawingImage,
  ])

  const handleSaveAs = useCallback(
    async (newDrawingFileName: string) => {
      if (!currentProceesedFile) return
      const extension = currentProceesedFile.name.split('.').pop()

      const file = new File([currentProceesedFile], `${newDrawingFileName}.${extension}`, {
        type: currentProceesedFile.type,
      })
      const result = await addNewDrawing(file)
      if (result) {
        notificationSnackbar.success(t('addNewDrawingMessageSuccess'))
      }
    },
    [addNewDrawing, currentProceesedFile, notificationSnackbar, t]
  )

  useEffect(() => {
    redrawCanvas()
  }, [boxes, redrawCanvas])

  useEffect(() => {
    dispatch(clearPredictorId())
    dispatch(clearFileDetail())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <PageTransition>
      <Box display={'flex'} flexDirection={'column'} padding={1} flex={1}>
        <Box display={'flex'} flexDirection={'row'} gap={2}>
          {/* <Box display={'flex'} flexDirection={'row'} gap={2}>
            <InputUploadFile onChoose={files => handleChooseFile(files)} ref={buttonUploadRef} />
          </Box> */}
          <Box
            display={'flex'}
            flexDirection={'row'}
            gap={2}
            flex={1}
            // justifyContent={'space-around'}
          >
            <Box display={'flex'} flex={1} gap={2}>
              <InputUploadFile onChoose={files => handleChooseFile(files)} ref={buttonUploadRef} />
              <Button variant='contained' onClick={handleProcessImage} disabled={actions === 0}>
                {t('processButton')}
              </Button>
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
            <Box display={'flex'} gap={2}>
              <Button variant='contained' disabled={!erasedDrawing}>
                {t('printButton')}
              </Button>
              <Button variant='contained' onClick={handleSave} disabled={!erasedDrawing}>
                {t('saveButton')}
              </Button>
              <Button
                variant='contained'
                onClick={() => setOpenModalAddNewDrawing(true)}
                disabled={!erasedDrawing}
              >
                {t('saveAsButton')}
              </Button>
            </Box>
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
                <Typography variant='h3'>{t('resultTitle')}</Typography>
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
          {openModalAddNewDrawing && (
            <AddNewDrawingModal
              onClose={() => setOpenModalAddNewDrawing(false)}
              open={openModalAddNewDrawing}
              onSubmit={handleSaveAs}
            />
          )}
        </Box>
      </Box>
    </PageTransition>
  )
}
