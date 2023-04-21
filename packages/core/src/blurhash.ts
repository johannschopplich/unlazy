import { decodeBlurHash } from 'fast-blurhash'
import { DEFAULT_BLURHASH_SIZE } from './constants'
import { calculateDimensions, getDataUriFromArr, isSSR } from './utils'
import { createBlurryImageSvg, encodeSvgAsDataUri } from './utils/image/svg'
import type { UnLazyLoadOptions } from './types'
import { getPngFromRgbaArr } from './utils/image'

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
  const { width, height } = calculateDimensions(ratio, blurhashSize)
  const rgba = decodeBlurHash(hash, width, height)
  const png = getPngFromRgbaArr(rgba, width, height)
  let base64: string

  if (isSSR) {
    const pngArray = new Uint8Array(Array.from(png, c => c.charCodeAt(0)))
    // eslint-disable-next-line n/prefer-global/buffer
    base64 = Buffer.from(pngArray).toString('base64')
  }
  else {
    base64 = btoa(png)
  }

  return `data:image/png;base64,${base64}`
}

export function createSvgDataUri(
  hash: string,
  {
    ratio = 1,
    blurhashSize = DEFAULT_BLURHASH_SIZE,
  }: BlurhashOptions = {},
) {
  const pngDataUri = createPngDataUri(hash, { ratio, blurhashSize })
  const { width, height } = calculateDimensions(ratio, blurhashSize)
  const svg = createBlurryImageSvg(pngDataUri, width, height)

  return encodeSvgAsDataUri(svg)
}

export function applyBlurhashPlaceholder(
  image: HTMLImageElement,
  blurhash: string,
  blurhashSize: number,
) {
  // Preserve the original image's aspect ratio
  const actualWidth = image.width || image.offsetWidth || blurhashSize
  const actualHeight = image.height || image.offsetHeight || blurhashSize
  const { width, height } = calculateDimensions(
    actualWidth / actualHeight,
    blurhashSize,
  )

  // Generate the blurry placeholder
  try {
    const pixels = decodeBlurHash(blurhash, width, height)
    const placeholder = getDataUriFromArr(pixels, width, height)
    image.src = placeholder
  }
  catch (error) {
    console.error('Error generating blurry placeholder:', error)
  }
}
