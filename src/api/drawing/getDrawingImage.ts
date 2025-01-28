import { ApiResponse, axiosInstance } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import axios from 'axios'

export default async function getDrawingImage(
  httpRequest: HttpRequest,
  drawingId: string
): Promise<ApiResponse<string>> {
  // const response = await httpRequest(() =>
  //   fetchInstance(`/api/drawings/get-drawing/${drawingId}`, {
  //     method: 'GET',
  //   })
  // )

  // if (!response.ok) {
  //   return {
  //     code: response.status,
  //     message: response.statusText,
  //     data: undefined,
  //   }
  // }
  // const result = await response.blob()
  // const imageObjectURL = URL.createObjectURL(result)
  // return { code: 200, message: 'success', data: imageObjectURL }

  const response = await httpRequest(() =>
    axiosInstance.get(`/api/drawings/get-drawing/${drawingId}`, {
      responseType: 'blob',
      headers: {
        ...axiosInstance.defaults.headers.common,
      },
    })
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
