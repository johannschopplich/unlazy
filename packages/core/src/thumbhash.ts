import { thumbHashToRGBA } from 'thumbhash'
import { rgbaToDataUri } from './utils/dataUri'

export function createPngDataUri(hash: string): string {
  const hashArray = base64ToUint8Array(hash)
  const { w, h, rgba } = thumbHashToRGBA(hashArray)

  return rgbaToDataUri(w, h, rgba)
}

function base64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  return Uint8Array.from(
    globalThis.atob(base64UrlToBase64(base64String)),
    x => x.charCodeAt(0),
  )
}

function base64UrlToBase64(base64Url: string): string {
  return base64Url.replaceAll('-', '+').replaceAll('_', '/')
}
