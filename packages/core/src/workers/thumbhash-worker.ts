import { thumbHashToRGBA } from 'thumbhash'
import { base64ToBytes } from '../utils'
import { rgbaToDataUri } from '../utils/dataUri'

interface MessageEventData {
  hash: string
}

onmessage = (event: MessageEvent<MessageEventData>) => {
  const { hash } = event.data

  const { w, h, rgba } = thumbHashToRGBA(base64ToBytes(hash))
  const dataURL = rgbaToDataUri(w, h, rgba)

  postMessage(dataURL)
}
