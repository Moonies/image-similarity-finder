import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

type RowData = {
  [key: string]: string | number
}
export type DrawingMessage = {
  column: string[]
  row: RowData[]
}

export default async function getMessage(
  httpRequest: HttpRequest,
  message: string
): Promise<ApiResponse<DrawingMessage>> {
  const response = await httpRequest(() =>
    axiosInstance.post(`/api/chat`, message, {
      headers: {
        'Content-Type': 'text/plain',
      },
    })
  )
  if (axios.isAxiosError(response)) {
    return { code: response?.code ?? 500, message: response.message, data: undefined }
  }

  return {
    code: 200,
    message: 'success',
    data: response?.data,
  }
}
