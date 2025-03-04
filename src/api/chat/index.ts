import { ApiResponse } from '@/api'
import { HttpRequest } from '@/hooks/useHttp'
import { default as getMessage, DrawingMessage } from './getMessage'

export interface ChatApi {
  getMessage: (message: string) => Promise<ApiResponse<DrawingMessage>>
}

export default function chat(httpRequest: HttpRequest): ChatApi {
  return {
    getMessage: message => getMessage(httpRequest, message),
  }
}
