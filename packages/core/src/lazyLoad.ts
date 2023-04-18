import { decodeBlurHash } from 'fast-blurhash'
import { DEFAULT_BLURHASH_SIZE } from './constants'
import { getBlurhashDimensions, getDataUriFromArr, isCrawler, isLazyLoadingSupported, toElementsArr } from './utils'
import type { UnLazyLoadOptions } from './types'

export function lazyLoad<T extends HTMLImageElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.
   *
   * @default 'img[loading="lazy"]'
   */
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[loading="lazy"]',
  {
    blurhash = true,
    blurhashSize = DEFAULT_BLURHASH_SIZE,
    onLoaded,
  }: UnLazyLoadOptions = {},
) {
  const cleanupFns = new Set<() => void>()

  for (const image of toElementsArr<T>(selectorsOrElements)) {
    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    updateSizesAttribute(image)

    // Generate the blurry placeholder from a Blurhash string if applicable
    const _blurhash = blurhash === true ? image.dataset.blurhash : blurhash
    if (_blurhash)
      applyBlurhashPlaceholder(image, _blurhash, blurhashSize)

    // Bail if the image doesn't provide a `data-src` or `data-srcset` attribute
    if (!image.dataset.src && !image.dataset.srcset)
      continue

    // Use the same logic as for crawlers when native lazy-loading is not supported
    if (isCrawler || !isLazyLoadingSupported) {
      updatePictureSources(image)
      updateImageSrcset(image)
      onLoaded?.(image)
      continue
    }

    if (image.complete && image.naturalWidth > 0) {
      // Load the image if it's already in the viewport
      loadImage(image, onLoaded)
      continue
    }

    // Otherwise, load the image when it enters the viewport
    const loadHandler = () => loadImage(image, onLoaded)
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
  for (const image of toElementsArr<T>(selectorsOrElements))
    updateSizesAttribute(image)
}

export function loadImage(
  image: HTMLImageElement,
  onLoaded?: (image: HTMLImageElement) => void,
) {
  const imageLoader = new Image()
  imageLoader.srcset = image.dataset.srcset!
  imageLoader.src = image.dataset.src!
  imageLoader.sizes = image.sizes

  imageLoader.addEventListener('load', () => {
    updatePictureSources(image)
    updateImageSrcset(image)
    updateImageSrc(image)
    onLoaded?.(image)
  })
}

function updateSizesAttribute(element: HTMLImageElement | HTMLSourceElement) {
  const { sizes } = element.dataset
  if (sizes !== 'auto')
    return

  const width = element instanceof HTMLSourceElement
    ? element.parentElement?.offsetWidth
    : element.offsetWidth

  if (width)
    element.sizes = `${width}px`
}

function updateImageSrc(image: HTMLImageElement | HTMLSourceElement) {
  image.src = image.dataset.src!
  image.removeAttribute('data-src')
}

function updateImageSrcset(image: HTMLImageElement | HTMLSourceElement) {
  image.srcset = image.dataset.srcset!
  image.removeAttribute('data-srcset')
}

function updatePictureSources(image: HTMLImageElement) {
  const picture = image.parentElement as HTMLPictureElement

  if (picture?.tagName.toLowerCase() === 'picture')
    [...picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]')].forEach(updateImageSrcset)
}

function applyBlurhashPlaceholder(
  image: HTMLImageElement,
  blurhash: string,
  blurhashSize: number,
) {
  // Preserve the original image's aspect ratio
  const actualWidth = image.width || image.offsetWidth || blurhashSize
  const actualHeight = image.height || image.offsetHeight || blurhashSize
  const { width, height } = getBlurhashDimensions(
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
