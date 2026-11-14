import type { AutoSizesOptions, TriggerLoadOptions, UnLazyLoadOptions } from './types'
import { createPngDataUri as createPngDataUriFromBlurHash } from './blurhash'
import { DEFAULT_IMAGE_PLACEHOLDER, DEFAULT_PLACEHOLDER_SIZE } from './constants'
import { installLcpWarning } from './lcpWarning'
import { createPngDataUri as createPngDataUriFromThumbHash } from './thumbhash'
import { debounce, isCrawler, toElementArray } from './utils'

const processedImages = new WeakSet<HTMLImageElement>()
const PRELOAD_ATTRIBUTES = [
  'referrerpolicy',
  'crossorigin',
  'fetchpriority',
  'decoding',
] as const
let placeholderCount = 0

// #region lazyLoad
export function lazyLoad<T extends HTMLImageElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.
   *
   * @default 'img[data-src], img[data-srcset]'
   */
  selectorsOrElements?: string | T | NodeListOf<T> | T[],
  options?: UnLazyLoadOptions,
): () => void
// #endregion lazyLoad
export function lazyLoad<T extends HTMLImageElement>(
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[data-src], img[data-srcset]',
  {
    hash = true,
    hashType = 'blurhash',
    placeholderSize = DEFAULT_PLACEHOLDER_SIZE,
    updateSizesOnResize = false,
    onImageLoad,
    onImageError,
  }: UnLazyLoadOptions = {},
): () => void {
  const cleanups = new Set<() => void>()

  // Every build but the `development` one defines `__UNLAZY_LOGGING__` as
  // `false`, so the logs ship only there and in an import of the source.
  // @ts-expect-error: Build-time variable.
  if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
    installLcpWarning()

  for (const image of toElementArray<T>(selectorsOrElements)) {
    // Skip images already processed in a prior call so callers can safely
    // re-invoke `lazyLoad` after dynamic DOM insertions.
    if (processedImages.has(image))
      continue

    const isEager = image.loading === 'eager'

    // Hint the browser to prioritize the fetch of above-the-fold images,
    // but respect an explicit author value if present.
    if (isEager && !image.hasAttribute('fetchpriority'))
      image.setAttribute('fetchpriority', 'high')

    // Resolve `data-sizes="auto"` for the img and any picture-source siblings,
    // optionally installing a single `ResizeObserver` to retrack on resize.
    cleanups.add(autoSizes(image, { updateOnResize: updateSizesOnResize }))

    // Generate the blurry placeholder from a Blurhash or ThumbHash string if applicable.
    if (
      // @ts-expect-error: Build-time variable.
      (typeof __UNLAZY_HASH_DECODING__ === 'undefined' || __UNLAZY_HASH_DECODING__)
      && hash
    ) {
      const placeholder = createPlaceholderFromHash({
        image,
        hash: typeof hash === 'string'
          ? hash
          : undefined,
        hashType,
        size: placeholderSize,
      })
      if (placeholder)
        image.src = withUniqueFragment(placeholder)
    }

    // Bail if the image does not provide a `data-src` or `data-srcset` attribute.
    if (!image.dataset.src && !image.dataset.srcset) {
      // @ts-expect-error: Build-time variable.
      if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
        console.error('[unlazy] Missing `data-src` or `data-srcset` attribute', image)
      continue
    }

    processedImages.add(image)

    const listeners = new AbortController()
    cleanups.add(() => listeners.abort())

    // Swap immediately for eager images (above-the-fold) and crawlers.
    // Listeners are attached pre-swap so the spec-async `load` task is caught
    // after the swap; cleanup detaches them if the consumer aborts early.
    if (isEager || isCrawler) {
      const outcomeHandler = (event: Event) => {
        listeners.abort()
        if (event.type === 'error')
          onImageError?.(image, event)
        else
          onImageLoad?.(image)
      }
      image.addEventListener('load', outcomeHandler, { signal: listeners.signal })
      image.addEventListener('error', outcomeHandler, { signal: listeners.signal })
      swapPictureSources(image)
      swapDataAttribute(image, 'srcset')
      swapDataAttribute(image, 'src')
      continue
    }

    // A lazy image needs a placeholder `src` to defer its `load` event until it
    // nears the viewport.
    if (!image.src)
      image.src = withUniqueFragment(DEFAULT_IMAGE_PLACEHOLDER)

    // Load the image immediately if it is already in the viewport.
    if (image.complete && image.naturalWidth > 0) {
      cleanups.add(triggerLoad(image, { onImageLoad, onImageError }))
      continue
    }

    // Otherwise, load the image when it enters the viewport.
    image.addEventListener('load', () => {
      listeners.abort()
      cleanups.add(triggerLoad(image, { onImageLoad, onImageError }))
    }, { signal: listeners.signal })
  }

  return () => {
    for (const fn of cleanups) fn()
    cleanups.clear()
  }
}

// #region autoSizes
/**
 * Resolves `data-sizes="auto"` to a numeric pixel width. Given an `<img>`
 * inside a `<picture>`, walks to every `<source data-sizes="auto">` sibling and
 * resolves them too. With `{ updateOnResize: true }`, a debounced
 * `ResizeObserver` retracks the rendered width on viewport changes.
 *
 * @returns A cleanup function that disconnects every observer created by this call.
 * Calling it on a one-shot invocation is a no-op.
 */
export function autoSizes<T extends HTMLImageElement | HTMLSourceElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to calculate the `sizes` attribute for.
   *
   * @default 'img[data-sizes="auto"], source[data-sizes="auto"]'
   */
  selectorsOrElements?: string | T | NodeListOf<T> | T[],
  options?: AutoSizesOptions,
): () => void
// #endregion autoSizes
export function autoSizes<T extends HTMLImageElement | HTMLSourceElement>(
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[data-sizes="auto"], source[data-sizes="auto"]',
  { updateOnResize = false }: AutoSizesOptions = {},
): () => void {
  const cleanups: (() => void)[] = []

  for (const element of toElementArray<T>(selectorsOrElements))
    cleanups.push(observeAutoSizes(element, updateOnResize))

  return () => {
    for (const fn of cleanups) fn()
    cleanups.length = 0
  }
}

// #region triggerLoad
/**
 * Triggers the loading of a lazy image by swapping `data-src`/`data-srcset` to `src`/`srcset`.
 *
 * @returns A cleanup function that detaches listeners and aborts any in-flight preload fetch.
 * Calling it after the load completes is a no-op.
 */
export function triggerLoad(
  image: HTMLImageElement,
  options?: TriggerLoadOptions,
): () => void
// #endregion triggerLoad
export function triggerLoad(
  image: HTMLImageElement,
  options: TriggerLoadOptions = {},
): () => void {
  return loadImage(image, options)
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
      // Preserve the original image's aspect ratio.
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
    // @ts-expect-error: Build-time variable.
    if (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
      console.error(`[unlazy] Failed to generate ${hashType} placeholder:`, error)
  }
}

function observeAutoSizes(
  element: HTMLImageElement | HTMLSourceElement,
  updateOnResize: boolean,
): () => void {
  // Each call resolves the element itself plus, for an `<img>` inside a
  // `<picture>`, every `<source data-sizes="auto">` sibling.
  const targets = collectAutoSizeTargets(element)
  for (const target of targets)
    updateSizesAttribute(target)

  if (!updateOnResize || !targets.some(hasAutoSizes))
    return noop

  // `<source>` elements have no layout box, so observe the rendered `<img>`.
  const observedImage = element instanceof HTMLImageElement
    ? element
    : (element.parentElement?.getElementsByTagName('img')[0] ?? null)
  if (!observedImage)
    return noop

  const update = debounce(() => {
    for (const target of collectAutoSizeTargets(element))
      updateSizesAttribute(target)
  }, 500)
  const observer = new ResizeObserver(update)
  observer.observe(observedImage)

  return () => observer.disconnect()
}

function hasAutoSizes(element: HTMLImageElement | HTMLSourceElement): boolean {
  return element.dataset.sizes === 'auto'
}

function collectAutoSizeTargets(
  element: HTMLImageElement | HTMLSourceElement,
): (HTMLImageElement | HTMLSourceElement)[] {
  const targets: (HTMLImageElement | HTMLSourceElement)[] = [element]
  if (
    element instanceof HTMLImageElement
    && element.parentElement?.tagName.toLowerCase() === 'picture'
  ) {
    for (const source of element.parentElement.querySelectorAll<HTMLSourceElement>('source[data-sizes="auto"]'))
      targets.push(source)
  }

  return targets
}

function loadImage(
  image: HTMLImageElement,
  { onImageLoad, onImageError }: TriggerLoadOptions,
): () => void {
  const picture = isDescendantOfPicture(image)
    ? image.parentElement
    : undefined
  const { srcset: dataSrcset, src: dataSrc, sizes: dataSizes } = image.dataset

  if (!dataSrcset && !dataSrc && !picture?.querySelector('source[data-srcset]'))
    return noop

  let sizes = image.sizes
  if (dataSizes === 'auto') {
    const width = getOffsetWidth(image)
    if (width)
      sizes = `${width}px`
  }

  // The temporary image fetches what the visible image will request: matching
  // `crossorigin` and `referrerpolicy` keep it to one request and one `Referer`
  // policy, and `fetchpriority` and `decoding` carry over the author's hints.
  const temporaryImage = new Image()
  for (const name of PRELOAD_ATTRIBUTES) {
    const value = image.getAttribute(name)
    if (value !== null)
      temporaryImage.setAttribute(name, value)
  }
  if (sizes)
    temporaryImage.sizes = sizes

  // A detached copy of the `<picture>` evaluates its sources against the same
  // window, so it preloads the source the visible picture selects after the swap.
  if (picture) {
    const temporaryPicture = document.createElement('picture')
    for (const source of picture.querySelectorAll<HTMLSourceElement>('source')) {
      updateSizesAttribute(source)
      const temporarySource = source.cloneNode() as HTMLSourceElement
      if (source.dataset.srcset)
        temporarySource.srcset = source.dataset.srcset
      temporaryPicture.append(temporarySource)
    }
    temporaryPicture.append(temporaryImage)
  }

  const preloadListeners = new AbortController()
  const visibleListeners = new AbortController()

  // The swapped-in source loads on the visible image after the preload. Writing
  // `sizes` on the loaded placeholder fires `load` again, so a `load` that
  // still shows the placeholder only counts if the preload fetched that URL.
  let placeholderSource = ''
  const visibleOutcomeHandler = (event: Event) => {
    if (
      event.type === 'load'
      && image.currentSrc === placeholderSource
      && image.currentSrc !== temporaryImage.currentSrc
    ) {
      return
    }
    visibleListeners.abort()
    if (event.type === 'error')
      onImageError?.(image, event)
    else
      onImageLoad?.(image)
  }
  const preloadLoadHandler = () => {
    // A detached `<picture>` selects its source again on a viewport change in
    // WebKit and Firefox, and a later error must not fail the visible image.
    preloadListeners.abort()
    placeholderSource = image.currentSrc
    updateSizesAttribute(image)
    swapPictureSources(image)
    swapDataAttribute(image, 'srcset')
    swapDataAttribute(image, 'src')
    image.addEventListener('load', visibleOutcomeHandler, { signal: visibleListeners.signal })
    image.addEventListener('error', visibleOutcomeHandler, { signal: visibleListeners.signal })
  }
  const preloadErrorHandler = (event: Event) => {
    preloadListeners.abort()
    // Dispatch the synthetic error on the visible `<img>` first so the public
    // contract (native error fires) is fulfilled before user code runs.
    image.dispatchEvent(new Event('error'))
    onImageError?.(image, event)
  }

  temporaryImage.addEventListener('load', preloadLoadHandler, { signal: preloadListeners.signal })
  temporaryImage.addEventListener('error', preloadErrorHandler, { signal: preloadListeners.signal })

  if (dataSrcset)
    temporaryImage.srcset = dataSrcset
  if (dataSrc)
    temporaryImage.src = dataSrc

  return () => {
    preloadListeners.abort()
    visibleListeners.abort()
    // Empty `src` aborts the pending fetch per HTML "update the image data".
    temporaryImage.src = ''
  }
}

function updateSizesAttribute(element: HTMLImageElement | HTMLSourceElement): void {
  if (element.dataset.sizes !== 'auto')
    return

  const width = getOffsetWidth(element)
  if (!width)
    return

  // Same-value writes still re-run source-set selection per HTML spec.
  const next = `${width}px`
  if (element.sizes !== next)
    element.sizes = next
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

function swapPictureSources(image: HTMLImageElement) {
  const picture = image.parentElement
  if (picture?.tagName.toLowerCase() !== 'picture')
    return

  for (const source of picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]')) {
    // Resolve `data-sizes="auto"` to a numeric pixel width before swapping
    // `srcset` so the browser sees a final value at source-selection time.
    updateSizesAttribute(source)
    swapDataAttribute(source, 'srcset')
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

/**
 * Appends a fragment that no other generated placeholder carries. Browsers
 * serve a URL that already loaded in the document from memory and fire `load`
 * at once, even for an off-screen lazy image, which would start loading the
 * real image right away.
 */
function withUniqueFragment(placeholder: string): string {
  return `${placeholder}#${++placeholderCount}`
}

function noop() {}
