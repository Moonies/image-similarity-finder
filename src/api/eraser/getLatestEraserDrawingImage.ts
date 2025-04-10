import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'
import { convertPdfToBlob } from '@/utils/fileConvert'

export default async function getLatestEraserDrawingImage(
  httpRequest: HttpRequest,
  predictorId: string,
  disableDisplayError = false
): Promise<ApiResponse<string>> {
  const response = await httpRequest(
    () =>
      axiosInstance.get(`/api/erase/save/${predictorId}`, {
        responseType: 'blob',
      }),
    disableDisplayError
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }
  if (response?.data.type === 'image/tiff' || response?.data.type === 'image/tif') {
    return {
      code: 200,
      message: 'success',
      data: URL.createObjectURL(response?.data),
    }
  } else if (response?.data.type === 'application/pdf') {
    const pdfBlob = await convertPdfToBlob(response.data)
    if (pdfBlob) {
      return {
        code: 200,
        message: 'success',
        data: pdfBlob,
      }
    } else {
      return {
        code: 500,
        message: 'convert failed',
        data: undefined,
      }
    }
  } else {
    return {
      code: 200,
      message: 'success',
      data: URL.createObjectURL(response?.data),
    }
  }
}
