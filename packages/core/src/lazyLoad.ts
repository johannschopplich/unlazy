import type { UnLazyLoadOptions } from './types'
import { createPngDataUri as createPngDataUriFromBlurHash } from './blurhash'
import { DEFAULT_PLACEHOLDER_SIZE } from './constants'
import { installLcpWarning } from './lcpWarning'
import { createPngDataUri as createPngDataUriFromThumbHash } from './thumbhash'
import { createIndexedImagePlaceholder, debounce, isCrawler, toElementArray } from './utils'

const processedImages = new WeakSet<HTMLImageElement>()
const resizeObserverCache = new WeakMap<HTMLImageElement | HTMLSourceElement, ResizeObserver>()

// #region lazyLoad
export function lazyLoad<T extends HTMLImageElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.
   *
   * @default 'img[loading="lazy"], img[loading="eager"][data-src], img[loading="eager"][data-srcset]'
   */
  selectorsOrElements?: string | T | NodeListOf<T> | T[],
  options?: UnLazyLoadOptions,
): () => void
// #endregion lazyLoad
export function lazyLoad<T extends HTMLImageElement>(
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[loading="lazy"], img[loading="eager"][data-src], img[loading="eager"][data-srcset]',
  {
    hash = true,
    hashType = 'blurhash',
    placeholderSize = DEFAULT_PLACEHOLDER_SIZE,
    updateSizesOnResize = false,
    onImageLoad,
    onImageError,
  }: UnLazyLoadOptions = {},
): () => void {
  const cleanupHandlers = new Set<() => void>()

  // @ts-expect-error: Build-time variable
  if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
    installLcpWarning()

  for (const [index, image] of toElementArray<T>(selectorsOrElements).entries()) {
    // Skip images already processed in a prior call so callers can safely
    // re-invoke `lazyLoad` after dynamic DOM insertions
    if (processedImages.has(image))
      continue

    const isEager = image.loading === 'eager'

    // Hint the browser to prioritize the fetch of above-the-fold images,
    // but respect an explicit author value if present
    if (isEager && !image.hasAttribute('fetchpriority'))
      image.setAttribute('fetchpriority', 'high')

    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    const resizeObserverCleanup = updateSizesAttribute(image, { updateOnResize: updateSizesOnResize })

    if (updateSizesOnResize && resizeObserverCleanup)
      cleanupHandlers.add(resizeObserverCleanup)

    // Generate the blurry placeholder from a Blurhash or ThumbHash string if applicable
    if (
      // @ts-expect-error: Build-time variable
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
      // @ts-expect-error: Build-time variable
      if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
        console.error('[unlazy] Missing `data-src` or `data-srcset` attribute', image)
      continue
    }

    processedImages.add(image)

    // Swap immediately for eager images (above-the-fold) and crawlers.
    // Listeners are attached pre-swap so the spec-async `load` task is caught
    // after the swap; cleanup detaches them if the consumer aborts early.
    if (isEager || isCrawler) {
      if (onImageLoad) {
        const loadHandler = () => onImageLoad(image)
        image.addEventListener('load', loadHandler, { once: true })
        cleanupHandlers.add(() => image.removeEventListener('load', loadHandler))
      }
      if (onImageError) {
        const errorHandler = (event: Event) => onImageError(image, event)
        image.addEventListener('error', errorHandler, { once: true })
        cleanupHandlers.add(() => image.removeEventListener('error', errorHandler))
      }
      updatePictureSources(image)
      swapDataAttribute(image, 'srcset')
      swapDataAttribute(image, 'src')
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
      cleanupHandlers.add(triggerLoad(image, { onImageLoad, onImageError }))
      continue
    }

    // Otherwise, load the image when it enters the viewport
    const loadHandler = () => {
      cleanupHandlers.add(triggerLoad(image, { onImageLoad, onImageError }))
    }
    image.addEventListener('load', loadHandler, { once: true })

    cleanupHandlers.add(
      () => image.removeEventListener('load', loadHandler),
    )
  }

  return () => {
    for (const fn of cleanupHandlers) fn()
    cleanupHandlers.clear()
  }
}

// #region autoSizes
export function autoSizes<T extends HTMLImageElement | HTMLSourceElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to calculate the `sizes` attribute for.
   *
   * @default 'img[data-sizes="auto"], source[data-sizes="auto"]'
   */
  selectorsOrElements?: string | T | NodeListOf<T> | T[],
): void
// #endregion autoSizes
export function autoSizes<T extends HTMLImageElement | HTMLSourceElement>(
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[data-sizes="auto"], source[data-sizes="auto"]',
): void {
  for (const image of toElementArray<T>(selectorsOrElements))
    updateSizesAttribute(image)
}

// #region triggerLoad
/**
 * Triggers the loading of a lazy image by swapping `data-src`/`data-srcset` to `src`/`srcset`.
 *
 * @returns A disposer that detaches listeners and, for standalone images, aborts any
 * in-flight network fetch by clearing the temporary image's `src`. Calling it after the
 * load completes is a no-op.
 *
 * @remarks
 * For standalone `<img>` elements, the image is preloaded via a temporary `Image` before
 * the swap; `onImageLoad` fires on success and `onImageError` on failure. On failure unlazy
 * also dispatches a synthetic `error` event on the visible `<img>` so consumers using
 * native `addEventListener('error', …)` or framework-native `onError` / `@error` get notified.
 *
 * For `<img>` elements inside `<picture>`, the browser handles source selection. Listeners
 * are attached on the visible `<img>` before the swap so the queued `load` task is caught
 * once the browser resolves a source.
 */
export function triggerLoad(
  image: HTMLImageElement,
  options?: {
    onImageLoad?: (image: HTMLImageElement) => void
    onImageError?: (image: HTMLImageElement, error: Event) => void
  },
): () => void
// #endregion triggerLoad
export function triggerLoad(
  image: HTMLImageElement,
  {
    onImageLoad,
    onImageError,
  }: {
    onImageLoad?: (image: HTMLImageElement) => void
    onImageError?: (image: HTMLImageElement, error: Event) => void
  } = {},
): () => void {
  const disposers: (() => void)[] = []
  const dispose = () => {
    for (const d of disposers) d()
    disposers.length = 0
  }

  if (isDescendantOfPicture(image)) {
    if (onImageLoad) {
      const handler = () => onImageLoad(image)
      image.addEventListener('load', handler, { once: true })
      disposers.push(() => image.removeEventListener('load', handler))
    }
    if (onImageError) {
      const handler = (event: Event) => onImageError(image, event)
      image.addEventListener('error', handler, { once: true })
      disposers.push(() => image.removeEventListener('error', handler))
    }

    updatePictureSources(image)
    swapDataAttribute(image, 'srcset')
    swapDataAttribute(image, 'src')
    return dispose
  }

  const { srcset: dataSrcset, src: dataSrc, sizes: dataSizes } = image.dataset

  if (!dataSrcset && !dataSrc)
    return dispose

  const temporaryImage = new Image()

  const loadHandler = () => {
    swapDataAttribute(image, 'srcset')
    swapDataAttribute(image, 'src')
    onImageLoad?.(image)
  }
  const errorHandler = (event: Event) => {
    // Dispatch the synthetic error on the visible `<img>` first so the public
    // contract (native error fires) is fulfilled before user code runs.
    image.dispatchEvent(new Event('error'))
    onImageError?.(image, event)
  }

  temporaryImage.addEventListener('load', loadHandler, { once: true })
  temporaryImage.addEventListener('error', errorHandler, { once: true })

  disposers.push(() => {
    temporaryImage.removeEventListener('load', loadHandler)
    temporaryImage.removeEventListener('error', errorHandler)
    // Empty `src` aborts the pending fetch per HTML "update the image data".
    temporaryImage.src = ''
  })

  // Calculate the correct `sizes` attribute if `data-sizes="auto"` is set
  if (dataSizes === 'auto') {
    const width = getOffsetWidth(image)
    if (width)
      temporaryImage.sizes = `${width}px`
  }
  else if (image.sizes) {
    temporaryImage.sizes = image.sizes
  }

  if (dataSrcset)
    temporaryImage.srcset = dataSrcset
  if (dataSrc)
    temporaryImage.src = dataSrc

  return dispose
}

// #region createPlaceholderFromHash
export function createPlaceholderFromHash(options?: {
  /** If present, the hash will be extracted from the image's `data-blurhash` or `data-thumbhash` attribute and ratio will be calculated from the image's actual dimensions. */
  image?: HTMLImageElement
  hash?: string
  hashType?: 'blurhash' | 'thumbhash'
  /** @default 32 */
  size?: number
  /** Will be calculated from the image's actual dimensions if image is provided and ratio is not. */
  ratio?: number
}): string | undefined
// #endregion createPlaceholderFromHash
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
): string | undefined {
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
        const elementWidth = image.width || image.offsetWidth || size
        const elementHeight = image.height || image.offsetHeight || size
        ratio = elementWidth / elementHeight
      }

      return createPngDataUriFromBlurHash(hash, { ratio, size })
    }

    return createPngDataUriFromThumbHash(hash)
  }
  catch (error) {
    // @ts-expect-error: Build-time variable
    if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
      console.error(`[unlazy] Failed to generate ${hashType} placeholder:`, error)
  }
}

function updateSizesAttribute(
  element: HTMLImageElement | HTMLSourceElement,
  options?: {
    updateOnResize?: boolean
  },
): (() => void) | undefined {
  if (element.dataset.sizes !== 'auto')
    return

  const width = getOffsetWidth(element)

  if (width)
    element.sizes = `${width}px`

  if (options?.updateOnResize) {
    if (!resizeObserverCache.has(element)) {
      const debouncedSizeUpdate = debounce(() => updateSizesAttribute(element), 500)
      const observer = new ResizeObserver(debouncedSizeUpdate)
      resizeObserverCache.set(element, observer)
      observer.observe(element)
    }

    return () => {
      const observer = resizeObserverCache.get(element)
      if (observer) {
        observer.disconnect()
        resizeObserverCache.delete(element)
      }
    }
  }
}

function swapDataAttribute(
  element: HTMLImageElement | HTMLSourceElement,
  attr: 'src' | 'srcset',
) {
  const value = element.dataset[attr]
  if (!value)
    return

  element[attr] = value
  element.removeAttribute(`data-${attr}`)
}

function updatePictureSources(image: HTMLImageElement) {
  const pictureElement = image.parentElement as HTMLPictureElement

  if (pictureElement?.tagName.toLowerCase() === 'picture') {
    for (const source of pictureElement.querySelectorAll<HTMLSourceElement>('source[data-srcset]')) {
      swapDataAttribute(source, 'srcset')
    }
  }
}

function getOffsetWidth(element: HTMLElement | HTMLSourceElement): number | undefined {
  return element instanceof HTMLSourceElement
    ? element.parentElement?.getElementsByTagName('img')[0]?.offsetWidth
    : element.offsetWidth
}

function isDescendantOfPicture(element: HTMLElement): element is HTMLElement & { parentElement: HTMLPictureElement } {
  return element.parentElement?.tagName.toLowerCase() === 'picture'
}
