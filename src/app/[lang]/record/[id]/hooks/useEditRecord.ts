import { DrawingImageDetail } from '@/api/drawing'
import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import useHttp from '@/hooks/useHttp'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function useEditRecord(drawingDetail: DrawingImageDetail) {
  const [recordData, setRecordData] = useState<Partial<DrawingImageDetail>>(drawingDetail)
  const [drawingImage, setDrawingImage] = useState<string>('')
  const { notificationSnackbar } = useNotification()
  const { t } = useTranslation('notification')

  const { setLoading } = useLoading()
  const { api } = useHttp()

  const getDrawingImage = useMemo(
    () => async (drawingId: string) => {
      const result = await api.drawing.getDrawingImage(drawingId)
      if (result.code === 200 && result.data) {
        console.log(result)
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

  const handleUpdateDrawingDetail = useCallback(
    async (formData: Partial<DrawingImageDetail>) => {
      setLoading(true)
      const response = await updateDrawingDetail(formData as UpdateDrawingImageDetail)
      if (response) return response
    },
    [setLoading, updateDrawingDetail]
  )

  const handleChange = (name: keyof DrawingImageDetail, value: string | number | null) => {
    setRecordData(prev => ({ ...prev, [name]: value }))
  }
  return { handleChange, recordData, getDrawingImage, drawingImage, handleUpdateDrawingDetail }
}
