import { decodeBlurHash } from 'fast-blurhash'
import { DEFAULT_BLURHASH_SIZE } from '../constants'
import { getBlurhashDimensions, isSSR } from '../utils'
import { encodeSvgAsDataUri, generateBlurredImageSvg } from '../svg'
import type { UnLazyLoadOptions } from '../types'
import { getPngFromRgbaArr } from './png'

export type BlurhashOptions = {
  /**
   * Aspect ratio (width / height) of the decoded BlurHash image.
   *
   * @default 1 (square aspect ratio)
   */
  ratio?: number
} & Pick<UnLazyLoadOptions, 'blurhashSize'>

export function createPngDataUriFromBlurHash(
  hash: string,
  {
    ratio = 1,
    blurhashSize = DEFAULT_BLURHASH_SIZE,
  }: BlurhashOptions = {},
) {
  const { width, height } = getBlurhashDimensions(ratio, blurhashSize)
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

export function createSvgDataUriFromBlurHash(
  hash: string,
  {
    ratio = 1,
    blurhashSize = DEFAULT_BLURHASH_SIZE,
  }: BlurhashOptions = {},
) {
  const pngDataUri = createPngDataUriFromBlurHash(hash, { ratio, blurhashSize })
  const { width, height } = getBlurhashDimensions(ratio, blurhashSize)
  const svg = generateBlurredImageSvg(pngDataUri, width, height)

  return encodeSvgAsDataUri(svg)
}
