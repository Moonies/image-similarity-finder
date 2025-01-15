import { UpdateDrawingImageDetail } from '@/api/drawing/updateDrawingDetail'
import useHttp from '@/hooks/useHttp'
import { useLoading } from '@/hooks/useLoading'
import { useNotification } from '@/hooks/useNotification'
import React, { useCallback } from 'react'

export default function useSearchDetail() {
  const { api } = useHttp()
  const { withLoading } = useLoading()
  const { notificationSnackbar } = useNotification()

  const handleGetDetailImage = useCallback(async (drawingNumber: string) => {
    const mockNumber = '$FGY5PC001'
    const response = await withLoading(getDrawingDetail(mockNumber))
    if (response) {
      return response
    }
  }, [])

  const handleUpdateDrawingDetail = useCallback(async (formData: UpdateDrawingImageDetail) => {
    const response = await withLoading(updateDrawingDetail(formData))
    //if u have a condition or event must to put here
    return response
  }, [])

  const getDrawingDetail = async (drawingNumber: string) => {
    const result = await api.drawing.getDrawingDetail(drawingNumber)
    if (result.code === 200 && result.data) {
      return result.data
    } else {
      // notificationSnackbar.error(result.message)
      // return result.data // if another data will be return in unsuccess
    }
  }

  const updateDrawingDetail = async (formData: UpdateDrawingImageDetail) => {
    const result = await api.drawing.updateDrawingDetail(formData)
    if (result.code === 200) {
      notificationSnackbar.success('update success')
      return true
    } else {
      return false
    }
  }
  return { handleGetDetailImage, handleUpdateDrawingDetail }
}
