import type { UnLazyLoadOptions } from './types'
import { createPngDataUri as createPngDataUriFromBlurHash } from './blurhash'
import { DEFAULT_PLACEHOLDER_SIZE } from './constants'
import { createPngDataUri as createPngDataUriFromThumbHash } from './thumbhash'
import { createIndexedImagePlaceholder, debounce, isCrawler, isLazyLoadingSupported, toElementArray } from './utils'

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

  for (const [index, image] of toElementArray<T>(selectorsOrElements).entries()) {
    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    const onResizeCleanup = updateSizesAttribute(image, { updateOnResize: updateSizesOnResize })

    if (updateSizesOnResize && onResizeCleanup)
      cleanupFns.add(onResizeCleanup)

    // Generate the blurry placeholder from a Blurhash or ThumbHash string if applicable
    if (
      (typeof __UNLAZY_HASH_DECODING__ === 'undefined' || __UNLAZY_HASH_DECODING__)
      && hash
    ) {
      const placeholder = createPlaceholderFromHash({
        image,
        hash: typeof hash === 'string' ? hash : undefined,
        hashType,
        size: placeholderSize,
      })
      if (placeholder)
        image.src = placeholder
    }

    // Bail if the image does not provide a `data-src` or `data-srcset` attribute
    if (!image.dataset.src && !image.dataset.srcset) {
      if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
        console.error('[unlazy] Missing `data-src` or `data-srcset` attribute', image)
      continue
    }

    // Load the image immediately if the browser is considered a crawler or
    // does not support lazy loading
    if (isCrawler || !isLazyLoadingSupported) {
      updatePictureSources(image)
      updateImageSrcset(image)
      updateImageSrc(image)
      continue
    }

    // Ensure that `loading="lazy"` works correctly by setting a default placeholder.
    // For Chrome, is is necessary to generate a unique placeholder. Otherwise, as
    // soon as the first placeholder is loaded, the `load` event will be triggered
    // for all subsequent images, even if they are not in the viewport.
    if (!image.src)
      image.src = createIndexedImagePlaceholder(index)

    // Load the image immediately if is already in the viewport
    if (image.complete && image.naturalWidth > 0) {
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
  const isChildOfPictureElement = image.parentElement?.tagName.toLowerCase() === 'picture'

  // Skip preloading its `data-src` or `data-srcset` to avoid unnecessary requests
  if (isChildOfPictureElement) {
    updatePictureSources(image)
    updateImageSrcset(image)
    updateImageSrc(image)
    onImageLoad?.(image)
    return
  }

  const imagePreLoader = new Image()
  const { srcset, src, sizes } = image.dataset

  // Calculate the correct `sizes` attribute if `data-sizes="auto"` is set
  if (sizes === 'auto') {
    const width = getOffsetWidth(image)
    if (width)
      imagePreLoader.sizes = `${width}px`
  }
  else if (image.sizes) {
    imagePreLoader.sizes = image.sizes
  }

  if (srcset)
    imagePreLoader.srcset = srcset
  if (src)
    imagePreLoader.src = src

  imagePreLoader.addEventListener('load', () => {
    updateImageSrcset(image)
    updateImageSrc(image)
    onImageLoad?.(image)
  }, { once: true })
}

export function createPlaceholderFromHash(
  {
    image,
    hash,
    hashType = 'blurhash',
    size = DEFAULT_PLACEHOLDER_SIZE,
    ratio,
  }: {
    /** If present, the hash will be extracted from the image's `data-blurhash` or `data-thumbhash` attribute and ratio will be calculated from the image's actual dimensions. */
    image?: HTMLImageElement
    hash?: string
    hashType?: 'blurhash' | 'thumbhash'
    /** @default 32 */
    size?: number
    /** Will be calculated from the image's actual dimensions if image is provided and ratio is not. */
    ratio?: number
  } = {},
) {
  if (image && !hash) {
    const { blurhash, thumbhash } = image.dataset
    hash = thumbhash || blurhash
    hashType = thumbhash ? 'thumbhash' : 'blurhash'
  }

  if (!hash)
    return

  try {
    if (hashType === 'blurhash') {
      // Preserve the original image's aspect ratio
      if (image && !ratio) {
        const actualWidth = image.width || image.offsetWidth || size
        const actualHeight = image.height || image.offsetHeight || size
        ratio = actualWidth / actualHeight
      }

      return createPngDataUriFromBlurHash(hash, { ratio, size })
    }

    return createPngDataUriFromThumbHash(hash)
  }
  catch (error) {
    if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
      console.error(`[unlazy] Failed to generate ${hashType} placeholder:`, error)
  }
}

// Keep track of elements that have a `data-sizes="auto"` attribute
// and need to be updated when their size changes
const elementResizeObserverMap = new WeakMap<HTMLImageElement | HTMLSourceElement, ResizeObserver>()

function updateSizesAttribute(
  element: HTMLImageElement | HTMLSourceElement,
  options?: {
    updateOnResize?: boolean
    skipChildren?: boolean
  },
) {
  if (element.dataset.sizes !== 'auto')
    return

  const width = getOffsetWidth(element)

  if (width)
    element.sizes = `${width}px`

  // Calculate the `sizes` attribute for sources inside a `<picture>` element
  if (
    element.parentElement?.tagName.toLowerCase() === 'picture'
    && !options?.skipChildren
  ) {
    for (const sourceTag of [...element.parentElement.getElementsByTagName('source')]) {
      updateSizesAttribute(sourceTag, { skipChildren: true })
    }
  }

  if (options?.updateOnResize) {
    if (!elementResizeObserverMap.has(element)) {
      const debounceResize = debounce(() => updateSizesAttribute(element), 500)
      const observerInstance = new ResizeObserver(debounceResize)
      elementResizeObserverMap.set(element, observerInstance)
      observerInstance.observe(element)
    }

    return () => {
      const observerInstance = elementResizeObserverMap.get(element)
      if (observerInstance) {
        observerInstance.disconnect()
        elementResizeObserverMap.delete(element)
      }
    }
  }
}

function updateImageSrc(image: HTMLImageElement | HTMLSourceElement) {
  if (image.dataset.src) {
    image.src = image.dataset.src
    image.removeAttribute('data-src')
  }
}

function updateImageSrcset(image: HTMLImageElement | HTMLSourceElement) {
  if (image.dataset.srcset) {
    image.srcset = image.dataset.srcset
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
