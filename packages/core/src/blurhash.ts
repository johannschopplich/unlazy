import { decodeBlurHash } from 'fast-blurhash'
import { DEFAULT_PLACEHOLDER_SIZE } from './constants'
import { rgbaToDataUri } from './utils/dataUri'

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
  const { width, height } = getAspectRatioDimensions(ratio, size)
  const rgba = decodeBlurHash(hash, width, height)
  return rgbaToDataUri(width, height, rgba)
}

function getAspectRatioDimensions(ratio: number, size: number) {
  const isLandscapeOrSquare = ratio >= 1

  return {
    width: isLandscapeOrSquare ? size : Math.round(size * ratio),
    height: isLandscapeOrSquare ? Math.round(size / ratio) : size,
  }
}
