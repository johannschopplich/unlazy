import { DEFAULT_PLACEHOLDER_SIZE } from './constants'
import { debounce, isCrawler, isLazyLoadingSupported, toElementArray } from './utils'
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
    updateSizesOnResize = false,
    onImageLoad,
  }: UnLazyLoadOptions = {},
) {
  const cleanupFns = new Set<() => void>()

  for (const image of toElementArray<T>(selectorsOrElements)) {
    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    cleanupFns.add(
      updateSizesAttribute(image, updateSizesOnResize),
    )

    // Calculate the `sizes` attribute for sources inside a `<picture>` element
    if (image.parentElement?.tagName.toLowerCase() === 'picture') {
      [...image.parentElement.getElementsByTagName('source')].forEach(
        sourceTag => updateSizesAttribute(sourceTag),
      )
    }

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
    if (!image.dataset.src && !image.dataset.srcset) {
      console.error('[unlazy] Missing `data-src` or `data-srcset` attribute', image)
      continue
    }

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
  const imagePreLoader = new Image()
  const { srcset, src, sizes } = image.dataset
  if (sizes) {
    // Calculate the correct `sizes` attribute if `data-sizes="auto"` is set
    const width = getOffsetWidth(image)
    imagePreLoader.sizes = (sizes === 'auto' && width) ? `${width}px` : sizes
  }
  if (srcset)
    imagePreLoader.srcset = srcset
  if (src)
    imagePreLoader.src = src

  imagePreLoader.addEventListener('load', () => {
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

// Keep track of elements that have a `data-sizes="auto"` attribute
// and need to be updated when their size changes
const resizeElementStore = new WeakMap<HTMLImageElement | HTMLSourceElement, ResizeObserver>()

export function updateSizesAttribute(element: HTMLImageElement | HTMLSourceElement, shouldUpdateOnResize = false) {
  const removeResizeObserver = () => {
    const observerInstance = resizeElementStore.get(element)
    if (!observerInstance)
      return

    observerInstance.disconnect()
    resizeElementStore.delete(element)
  }

  const { sizes } = element.dataset
  if (sizes !== 'auto')
    return removeResizeObserver

  const width = getOffsetWidth(element)

  if (width)
    element.sizes = `${width}px`

  if (shouldUpdateOnResize && !resizeElementStore.has(element)) {
    const debounceResize = debounce(() => updateSizesAttribute(element), 500)
    const observerInstance = new ResizeObserver(debounceResize)
    resizeElementStore.set(element, observerInstance)
    observerInstance.observe(element)
  }

  return removeResizeObserver
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

function getOffsetWidth(element: HTMLElement | HTMLSourceElement) {
  return element instanceof HTMLSourceElement
    ? element.parentElement?.getElementsByTagName('img')[0]?.offsetWidth
    : element.offsetWidth
}
