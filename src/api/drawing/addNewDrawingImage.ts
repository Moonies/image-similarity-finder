import { HttpRequest } from '@/hooks/useHttp'
import { ApiResponse, axiosInstance } from '@/api'
import axios from 'axios'

export default async function addNewDrawingImage(
  httpRequest: HttpRequest,
  newImageFile: File | FileList
): Promise<ApiResponse<null>> {
  const formData = new FormData()
  // formData.append('files', newImageFile)

  if (newImageFile instanceof FileList) {
    // If it's a FileList, loop through and append each file
    for (let i = 0; i < newImageFile.length; i++) {
      formData.append('files', newImageFile[i])
    }
  } else if (newImageFile instanceof File) {
    // If it's a single File, append it directly
    formData.append('files', newImageFile)
  }

  const response = await httpRequest(() =>
    axiosInstance.post(`/api/drawings/add-drawing`, formData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'multipart/form-data',
      },
    })
  )
  if (axios.isAxiosError(response)) {
    return {
      code: response?.code ?? 500,
      message: response.message,
      data: undefined,
    }
  }
  return { code: 200, message: 'success', data: null }
}
