import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export interface EraserDrawingDetail {
  height: number
  width: number
  drawingFile: string
}

export default async function addEraserDrawingImage(
  httpRequest: HttpRequest,
  searchImage: File,
  predictorId: string
): Promise<ApiResponse<EraserDrawingDetail>> {
  const formData = new FormData()
  formData.append('file', searchImage)

  const response = await httpRequest(() =>
    axiosInstance.post(`/api/erase/prepare/${predictorId}`, formData, {
      responseType: 'blob',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  const height = response?.headers['x-image-height']
  const width = response?.headers['x-image-width']

  return {
    code: 200,
    message: 'success',
    data: { drawingFile: URL.createObjectURL(response?.data), height: height, width: width },
  }
}
