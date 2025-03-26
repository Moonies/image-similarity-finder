import { default as getManuel } from './getManuel'
export interface FilesApi {
  getManuel: () => Promise<{ result: any }>
}

export default function files(): FilesApi {
  return {
    getManuel: () => getManuel(),
  }
}
