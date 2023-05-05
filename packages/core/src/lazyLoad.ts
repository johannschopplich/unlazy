import { DEFAULT_PLACEHOLDER_SIZE } from './constants'
import { isCrawler, isLazyLoadingSupported, toElementArray } from './utils'
import { createPngDataUri as createPngDataUriFromThumbHash } from './thumbhash'
import { createPngDataUri as createPngDataUriFromBlurHash } from './blurhash'
import type { UnLazyLoadOptions } from './types'

// Compile-time flag to exclude BlurHash and ThumbHash from IIFE bundle
const __ENABLE_HASH_DECODING__ = true

export function lazyLoad<T extends HTMLImageElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.
   *
   * @default 'img[loading="lazy"]'
   */
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[loading="lazy"]',
  {
    hash = true,
    hashType = 'blurhash',
    placeholderSize = DEFAULT_PLACEHOLDER_SIZE,
    onImageLoad,
  }: UnLazyLoadOptions = {},
) {
  const cleanupFns = new Set<() => void>()

  for (const image of toElementArray<T>(selectorsOrElements)) {
    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    updateSizesAttribute(image)

    // Calculate the `sizes` attribute for sources inside a `<picture>` element
    if (image.parentElement?.tagName.toLowerCase() === 'picture')
      [...image.parentElement.getElementsByTagName('source')].forEach(updateSizesAttribute)

    // Generate the blurry placeholder from a Blurhash or ThumbHash string if applicable
    if (__ENABLE_HASH_DECODING__ && hash) {
      const placeholder = createPlaceholderFromHash({
        image,
        hash: typeof hash === 'string' ? hash : undefined,
        hashType,
        size: placeholderSize,
      })
      if (placeholder)
        image.src = placeholder
    }

    // Bail if the image doesn't provide a `data-src` or `data-srcset` attribute
    if (!image.dataset.src && !image.dataset.srcset)
      continue

    // Use the same logic as for crawlers when native lazy-loading is not supported
    if (isCrawler || !isLazyLoadingSupported) {
      updatePictureSources(image)
      updateImageSrcset(image)
      updateImageSrc(image)
      continue
    }

    if (image.complete && image.naturalWidth > 0) {
      // Load the image if it's already in the viewport
      loadImage(image, onImageLoad)
      continue
    }

    // Otherwise, load the image when it enters the viewport
    const loadHandler = () => loadImage(image, onImageLoad)
    image.addEventListener('load', loadHandler, { once: true })

    cleanupFns.add(
      () => image.removeEventListener('load', loadHandler),
    )
  }

  return () => {
    for (const fn of cleanupFns) fn()
    cleanupFns.clear()
  }
}

export function autoSizes<T extends HTMLImageElement | HTMLSourceElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to calculate the `sizes` attribute for.
   *
   * @default 'img[data-sizes="auto"], source[data-sizes="auto"]'
   */
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[data-sizes="auto"], source[data-sizes="auto"]',
) {
  for (const image of toElementArray<T>(selectorsOrElements))
    updateSizesAttribute(image)
}

export function loadImage(
  image: HTMLImageElement,
  onImageLoad?: (image: HTMLImageElement) => void,
) {
  const imageLoader = new Image()
  const { srcset, src, sizes } = image.dataset
  if (srcset)
    imageLoader.srcset = srcset
  if (src)
    imageLoader.src = src
  if (sizes)
    imageLoader.sizes = sizes

  imageLoader.addEventListener('load', () => {
    updatePictureSources(image)
    updateImageSrcset(image)
    updateImageSrc(image)
    onImageLoad?.(image)
  })
}

export function createPlaceholderFromHash(
  {
    /** If given, the hash will be extracted from the image's `data-blurhash` or `data-thumbhash` attribute and ratio will be calculated from the image's actual dimensions */
    image,
    hash,
    hashType = 'blurhash',
    /** @default 32 */
    size = DEFAULT_PLACEHOLDER_SIZE,
    /** Will be calculated from the image's actual dimensions if not provided and image is given */
    ratio,
  }: {
    image?: HTMLImageElement
    hash?: string
    hashType?: 'blurhash' | 'thumbhash'
    size?: number
    ratio?: number
  } = {},
) {
  if (!hash && image) {
    const { blurhash, thumbhash } = image.dataset
    hash = thumbhash || blurhash
    hashType = thumbhash ? 'thumbhash' : 'blurhash'
  }

  if (!hash)
    return

  try {
    if (hashType === 'thumbhash') {
      return createPngDataUriFromThumbHash(hash)
    }
    else {
      // Preserve the original image's aspect ratio
      if (!ratio && image) {
        const actualWidth = image.width || image.offsetWidth || size
        const actualHeight = image.height || image.offsetHeight || size
        ratio = actualWidth / actualHeight
      }
      return createPngDataUriFromBlurHash(hash, { ratio, size })
    }
  }
  catch (error) {
    console.error(`Error generating ${hashType} placeholder:`, error)
  }
}

function updateSizesAttribute(element: HTMLImageElement | HTMLSourceElement) {
  const { sizes } = element.dataset
  if (sizes !== 'auto')
    return

  const width = element instanceof HTMLSourceElement
    ? element.parentElement?.getElementsByTagName('img')[0]?.offsetWidth
    : element.offsetWidth

  if (width)
    element.sizes = `${width}px`
}

function updateImageSrc(image: HTMLImageElement | HTMLSourceElement) {
  if (image.dataset.src) {
    image.src = image.dataset.src!
    image.removeAttribute('data-src')
  }
}

function updateImageSrcset(image: HTMLImageElement | HTMLSourceElement) {
  if (image.dataset.srcset) {
    image.srcset = image.dataset.srcset!
    image.removeAttribute('data-srcset')
  }
}

function updatePictureSources(image: HTMLImageElement) {
  const picture = image.parentElement as HTMLPictureElement

  if (picture?.tagName.toLowerCase() === 'picture') {
    [...picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]')].forEach(updateImageSrcset);
    [...picture.querySelectorAll<HTMLSourceElement>('source[data-src]')].forEach(updateImageSrc)
  }
}
