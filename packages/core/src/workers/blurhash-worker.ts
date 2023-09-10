import { decodeBlurHash } from 'fast-blurhash'
import { getScaledDimensions } from '../utils'
import { rgbaToDataUri } from '../utils/dataUri'

interface MessageEventData {
  hash: string
  ratio: number
  size: number
}

onmessage = (event: MessageEvent<MessageEventData>) => {
  const { hash, ratio, size } = event.data

  const { width, height } = getScaledDimensions(ratio, size)
  const rgba = decodeBlurHash(hash, width, height)
  const dataURL = rgbaToDataUri(width, height, rgba)

  postMessage(dataURL)
}
