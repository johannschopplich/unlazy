import { thumbHashToRGBA } from 'thumbhash'
import { base64ToBytes } from './utils'
import { rgbaToDataUri } from './utils/dataUri'

export function createPngDataUri(hash: string) {
  const { w, h, rgba } = thumbHashToRGBA(base64ToBytes(hash))
  return rgbaToDataUri(w, h, rgba)
}
