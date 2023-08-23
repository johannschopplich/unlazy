import { DEFAULT_PLACEHOLDER_SIZE } from './constants'

export interface BlurHashOptions {
  /**
   * Aspect ratio (width / height) of the BlurHash image to be decoded.
   *
   * @default 1 (square aspect ratio)
   */
  ratio?: number

  /**
   * The size of the longer edge (width or height) of the BlurHash image to be
   * decoded, depending on the aspect ratio.
   *
   * @default 32
   */
  size?: number
}

export function createPngDataUri(
  hash: string,
  {
    ratio = 1,
    size = DEFAULT_PLACEHOLDER_SIZE,
  }: BlurHashOptions = {},
) {
  const worker = new Worker('./workers/blurhash-worker.ts')
  worker.postMessage({
    hash,
    ratio,
    size,
  })

  return new Promise<string>((resolve) => {
    worker.onmessage = (event) => {
      resolve(event.data)
    }
  })
}
