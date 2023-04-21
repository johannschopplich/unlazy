import { decodeBlurHash } from 'fast-blurhash'
import { DEFAULT_BLURHASH_SIZE } from './constants'
import { getScaledDimensions } from './utils'
import { arrayToDataUri, createBlurryImageSvg, rgbaToDataUri, svgToDataUri } from './utils/dataUri'
import type { UnLazyLoadOptions } from './types'

export type BlurhashOptions = {
  /**
   * Aspect ratio (width / height) of the decoded BlurHash image.
   *
   * @default 1 (square aspect ratio)
   */
  ratio?: number
} & Pick<UnLazyLoadOptions, 'blurhashSize'>

export function createPngDataUri(
  hash: string,
  {
    ratio = 1,
    blurhashSize = DEFAULT_BLURHASH_SIZE,
  }: BlurhashOptions = {},
) {
  const { width, height } = getScaledDimensions(ratio, blurhashSize)
  const rgba = decodeBlurHash(hash, width, height)
  return rgbaToDataUri(width, height, rgba)
}

export function createSvgDataUri(
  hash: string,
  {
    ratio = 1,
    blurhashSize = DEFAULT_BLURHASH_SIZE,
  }: BlurhashOptions = {},
) {
  const pngDataUri = createPngDataUri(hash, { ratio, blurhashSize })
  const { width, height } = getScaledDimensions(ratio, blurhashSize)
  const svg = createBlurryImageSvg(pngDataUri, width, height)

  return svgToDataUri(svg)
}

export function applyBlurhashPlaceholder(
  image: HTMLImageElement,
  blurhash: string,
  blurhashSize: number,
) {
  // Preserve the original image's aspect ratio
  const actualWidth = image.width || image.offsetWidth || blurhashSize
  const actualHeight = image.height || image.offsetHeight || blurhashSize
  const { width, height } = getScaledDimensions(
    actualWidth / actualHeight,
    blurhashSize,
  )

  // Generate the blurry placeholder
  try {
    const pixels = decodeBlurHash(blurhash, width, height)
    const placeholder = arrayToDataUri(pixels, width, height)
    image.src = placeholder
  }
  catch (error) {
    console.error('Error generating blurry placeholder:', error)
  }
}
