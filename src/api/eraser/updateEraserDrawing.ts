import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export interface UpdateEraserDetail {
  drawingFile: Blob | undefined
}

export default async function updateEraserDrawing(
  httpRequest: HttpRequest,
  newEraser: string,
  predictorId: string
): Promise<ApiResponse<string>> {
  const response = await httpRequest(() =>
    axiosInstance.post(
      `/api/erase/submit-mask/${predictorId}`,
      { mask: newEraser },
      {
        responseType: 'blob',
        headers: {
          'Access-Control-Allow-Origin': '*',
          // 'Content-Type': 'multipart/form-data',
        },
      }
    )
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }

  return {
    code: 200,
    message: 'success',
    data: URL.createObjectURL(response?.data),
  }
}
