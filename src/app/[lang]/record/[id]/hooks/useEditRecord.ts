import { DrawingImageDetail } from '@/api/drawing'
import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import useHttp from '@/hooks/useHttp'
import { useNotification } from '@/hooks/useNotification'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function useEditRecord(drawingDetail: DrawingImageDetail) {
  const [recordData, setRecordData] = useState<Partial<DrawingImageDetail>>(drawingDetail)
  const [drawingImage, setDrawingImage] = useState<string>('')
  const { notificationSnackbar } = useNotification()
  const { t } = useTranslation('notification')
  const { api } = useHttp()

  const getDrawingImage = useMemo(
    () => async (drawingId: string) => {
      const result = await api.drawing.getDrawingImage(drawingId)
      if (result.code === 200 && result.data) {
        // console.log(result)
        setDrawingImage(result.data)
      }
    },
    [api.drawing]
  )

  const updateDrawingDetail = useMemo(
    () => async (formData: UpdateDrawingImageDetail) => {
      const result = await api.drawing.updateDrawingDetail(formData)
      if (result.code === 200) {
        notificationSnackbar.success(t('update.success'))
        return true
      }
    },
    [api.drawing, notificationSnackbar, t]
  )

  const updateDrawingImage = useMemo(
    () => async (drawingImage: File, drawingId: string) => {
      const result = await api.drawing.updateDrawingImage(drawingImage, drawingId)
      if (result.code !== 200) return false
      return true
    },
    [api.drawing]
  )

  const handleUpdateDrawing = useCallback(
    async (formData: Partial<DrawingImageDetail>, newDrawingImage?: File) => {
      if (newDrawingImage && formData.id) {
        const result = await updateDrawingImage(newDrawingImage, formData?.id)
        if (!result) return result
      }
      const response = await updateDrawingDetail(formData as UpdateDrawingImageDetail)
      if (response) return response
    },
    [updateDrawingDetail, updateDrawingImage]
  )

  const handleChange = (name: keyof DrawingImageDetail, value: string | number | null) => {
    setRecordData(prev => ({ ...prev, [name]: value }))
  }
  return {
    handleChange,
    recordData,
    getDrawingImage,
    drawingImage,
    setDrawingImage,
    handleUpdateDrawing,
  }
}
