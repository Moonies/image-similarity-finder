import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import useHttp from '@/hooks/useHttp'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export default function useSearchDetail() {
  const { api } = useHttp()
  const { withLoading } = useLoading()
  const { notificationSnackbar } = useNotification()
  const { t } = useTranslation('notification')

  const getDrawingDetail = useMemo(
    () => async (drawingNumber: string) => {
      const result = await api.drawing.getDrawingDetail(drawingNumber)
      if (result.code === 200 && result.data) {
        return result.data
      } else {
        // notificationSnackbar.error(result.message)
        // return result.data // if another data will be return in unsuccess
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
      } else {
        return false
      }
    },
    [api.drawing, notificationSnackbar, t]
  )

  const handleGetDetailImage = useCallback(
    async (selectedDrawing: string) => {
      // const mockNumber = '$FGY5PC001'
      const drawingNumber = selectedDrawing.split('.')[0]
      const response = await withLoading(getDrawingDetail(drawingNumber))
      if (response) {
        return response
      }
    },
    [getDrawingDetail, withLoading]
  )

  const handleUpdateDrawingDetail = useCallback(
    async (formData: UpdateDrawingImageDetail) => {
      const response = await withLoading(updateDrawingDetail(formData))
      //if u have a condition or event must to put here
      return response
    },
    [updateDrawingDetail, withLoading]
  )

  return { handleGetDetailImage, handleUpdateDrawingDetail }
}
