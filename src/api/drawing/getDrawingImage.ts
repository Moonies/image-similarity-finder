import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { convertTifToBlob } from '@/utils/fileConvert'
import axios from 'axios'

export default async function getDrawingImage(
  httpRequest: HttpRequest,
  drawingId: string
): Promise<ApiResponse<string>> {
  const response = await httpRequest(() =>
    axiosInstance.get(`/api/drawings/${drawingId}/originalImage`, {
      responseType: 'blob',
      headers: {
        ...axiosInstance.defaults.headers.common,
      },
    })
  )

  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  if (response?.data.type === 'image/tiff' || response?.data.type === 'image/tif') {
    const tifBlob = await convertTifToBlob(response?.data)
    if (tifBlob) {
      return {
        code: 200,
        message: 'success',
        data: URL.createObjectURL(tifBlob),
      }
    }
    return {
      code: 500,
      message: 'convert failed',
      data: undefined,
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: URL.createObjectURL(response?.data),
    }
  }
}
