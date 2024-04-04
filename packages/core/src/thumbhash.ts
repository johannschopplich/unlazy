import { thumbHashToRGBA } from 'thumbhash'
import { rgbaToDataUri } from './utils/dataUri'

export function createPngDataUri(hash: string) {
  const hashArray = base64ToUint8Array(hash)
  const { w, h, rgba } = thumbHashToRGBA(hashArray)

  return rgbaToDataUri(w, h, rgba)
}

function base64ToUint8Array(base64String: string) {
  return Uint8Array.from(
    globalThis.atob(base64UrlToBase64(base64String)),
    x => x.charCodeAt(0),
  )
}

function base64UrlToBase64(base64url: string) {
  return base64url.replaceAll('-', '+').replaceAll('_', '/')
}
