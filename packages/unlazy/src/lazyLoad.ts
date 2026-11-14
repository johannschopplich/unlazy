import type { AutoSizesOptions, CreatePlaceholderFromHashOptions, TriggerLoadOptions, UnLazyLoadOptions } from './types'
import { createPngDataUri as createPngDataUriFromBlurHash } from './blurhash'
import { DEFAULT_IMAGE_PLACEHOLDER, DEFAULT_PLACEHOLDER_SIZE } from './constants'
import { installLcpWarning } from './lcpWarning'
import { createPngDataUri as createPngDataUriFromThumbHash } from './thumbhash'
import { debounce, isCrawler, toElementArray } from './utils'

const processedImages = new WeakSet<HTMLImageElement>()
// A cleanup keeps the entry, so a re-run tells an image unlazy swapped from one
// it never touched, even before its queued `load` fires.
const swapStates = new WeakMap<HTMLImageElement, 'pending' | 'settled'>()
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
    preload = false,
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

    const isEager = image.loading !== 'lazy'

    // Hint the browser to prioritize the fetch of above-the-fold images,
    // but respect an explicit author value if present.
    if (isEager && !image.hasAttribute('fetchpriority'))
      image.setAttribute('fetchpriority', 'high')

    // Resolve `data-sizes="auto"` for the img and any picture-source siblings,
    // optionally installing a single `ResizeObserver` to retrack on resize.
    cleanups.add(autoSizes(image, { updateOnResize: updateSizesOnResize }))

    const shouldSwapEagerly = isEager || isCrawler
    const isSwapPending = hasPendingSource(image)
    const isLoadingEagerly = shouldSwapEagerly && !isSwapPending && swapStates.get(image) === 'pending'

    // Bail before the hash decode if there is nothing to swap in, so an image
    // that already has a source keeps it.
    if (!isSwapPending && !isLoadingEagerly) {
      if (
        !image.hasAttribute('src') && !image.hasAttribute('srcset')
        // @ts-expect-error: Build-time variable.
        && (typeof __UNLAZY_LOGGING__ === 'undefined' || __UNLAZY_LOGGING__)
      ) {
        console.error('[unlazy] Missing `data-src` or `data-srcset` attribute', image)
      }
      continue
    }

    processedImages.add(image)
    cleanups.add(() => processedImages.delete(image))

    const listeners = new AbortController()
    cleanups.add(() => listeners.abort())

    // Swap immediately for eager images (above-the-fold) and crawlers. A hash
    // placeholder would be replaced in the same task, before it is painted.
    if (shouldSwapEagerly) {
      // Swapping first runs the settle listener ahead of the outcome listener,
      // so a re-run from a callback, or from a microtask it queues, finds the
      // image settled.
      if (isSwapPending)
        swapSources(image)
      const outcomeHandler = (event: Event) => {
        listeners.abort()
        reportImageOutcome(image, event, { onImageLoad, onImageError })
      }
      image.addEventListener('load', outcomeHandler, { signal: listeners.signal })
      image.addEventListener('error', outcomeHandler, { signal: listeners.signal })
      continue
    }

    // An image unlazy already swapped that waits only on a `<source>` of its
    // `<picture>` keeps its own sources as the fallback, so it skips the
    // placeholders.
    if (
      swapStates.has(image)
      && !hasOwnPendingSource(image)
      && (image.hasAttribute('src') || image.hasAttribute('srcset'))
    ) {
      cleanups.add(loadImage(image, { onImageLoad, onImageError }, { shouldLoadEagerly: preload }))
      continue
    }

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

    if (preload) {
      cleanups.add(triggerLoad(image, { onImageLoad, onImageError }))
      continue
    }

    // A lazy image needs a placeholder `src` to defer its `load` event until it
    // nears the viewport.
    if (!image.src)
      image.src = withUniqueFragment(DEFAULT_IMAGE_PLACEHOLDER)

    // Load the image immediately if it is already in the viewport.
    if (image.complete && image.naturalWidth > 0) {
      cleanups.add(loadImage(image, { onImageLoad, onImageError }))
      continue
    }

    // Otherwise, load the image when it enters the viewport.
    image.addEventListener('load', () => {
      listeners.abort()
      cleanups.add(loadImage(image, { onImageLoad, onImageError }))
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
 * `ResizeObserver` resolves them again when the rendered width changes.
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
// TODO: Switch to native `sizes="auto"` once it is Baseline Widely available.
// It applies to lazy images only, so eager images then need an explicit
// `sizes`, and the preload in `loadImage` must stop resolving a width of its own.
export function autoSizes<T extends HTMLImageElement | HTMLSourceElement>(
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[data-sizes="auto"], source[data-sizes="auto"]',
  { updateOnResize = false }: AutoSizesOptions = {},
): () => void {
  const cleanups: (() => void)[] = []
  const elements = toElementArray<T>(selectorsOrElements)
  // An `<img>` inside a `<picture>` resolves and observes its `<source>`
  // siblings itself, so a listed sibling would get a second observer.
  const imagePictures = new Set<Element>()
  for (const element of elements) {
    if (element instanceof HTMLImageElement && isDescendantOfPicture(element))
      imagePictures.add(element.parentElement)
  }

  for (const element of elements) {
    if (element instanceof HTMLSourceElement && element.parentElement && imagePictures.has(element.parentElement))
      continue

    cleanups.push(observeAutoSizes(element, updateOnResize))
  }

  return () => {
    for (const fn of cleanups) fn()
    cleanups.length = 0
  }
}

// #region triggerLoad
/**
 * Loads a lazy image right away, even far from the viewport, by swapping
 * `data-src`/`data-srcset` to `src`/`srcset`.
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
  return loadImage(image, options, { shouldLoadEagerly: true })
}

// #region createPlaceholderFromHash
export function createPlaceholderFromHash(options?: CreatePlaceholderFromHashOptions): string | undefined
// #endregion createPlaceholderFromHash
export function createPlaceholderFromHash(
  {
    image,
    hash,
    hashType = 'blurhash',
    size = DEFAULT_PLACEHOLDER_SIZE,
    ratio,
  }: CreatePlaceholderFromHashOptions = {},
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
      // Preserve the original image's aspect ratio. `width` and `height` read
      // the rendered box, else the attributes or the natural size; with either
      // side unknown, the placeholder stays square.
      if (image && !ratio && image.width && image.height)
        ratio = image.width / image.height

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

/**
 * Applies the `load` or `error` event of an image that loads its own sources:
 * a `load` removes the `data-error` attribute and calls `onImageLoad`, an
 * `error` sets `data-error` and calls `onImageError`.
 */
export function reportImageOutcome(
  image: HTMLImageElement,
  event: Event,
  { onImageLoad, onImageError }: TriggerLoadOptions = {},
): void {
  if (event.type === 'error') {
    image.setAttribute('data-error', '')
    onImageError?.(image, event)
  }
  else {
    image.removeAttribute('data-error')
    onImageLoad?.(image)
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

  return () => {
    observer.disconnect()
    update.cancel()
  }
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
  { shouldLoadEagerly = false }: { shouldLoadEagerly?: boolean } = {},
): () => void {
  const picture = isDescendantOfPicture(image)
    ? image.parentElement
    : undefined
  const { srcset: dataSrcset, src: dataSrc, sizes: dataSizes } = image.dataset

  if (!hasPendingSource(image))
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
    reportImageOutcome(image, event, { onImageLoad, onImageError })
  }
  const preloadLoadHandler = () => {
    // A detached `<picture>` selects its source again on a viewport change in
    // WebKit and Firefox, and a later error must not fail the visible image.
    preloadListeners.abort()
    placeholderSource = image.currentSrc
    // A lazy image defers the swapped-in source until it nears the viewport,
    // even once the preload has fetched it, in WebKit and Firefox. Switching
    // only now keeps the image lazy for a `lazyLoad` call after an early cleanup.
    if (shouldLoadEagerly)
      image.loading = 'eager'
    updateSizesAttribute(image)
    // Swapping first runs the settle listener ahead of the outcome listener,
    // so a re-run from a callback, or from a microtask it queues, finds the
    // image settled.
    swapSources(image)
    image.addEventListener('load', visibleOutcomeHandler, { signal: visibleListeners.signal })
    image.addEventListener('error', visibleOutcomeHandler, { signal: visibleListeners.signal })
  }
  const preloadErrorHandler = (event: Event) => {
    preloadListeners.abort()
    image.setAttribute('data-error', '')
    // Dispatch the synthetic error on the visible `<img>` first so the public
    // contract (native error fires) is fulfilled before user code runs.
    image.dispatchEvent(new Event('error'))
    onImageError?.(image, event)
  }

  temporaryImage.addEventListener('load', preloadLoadHandler, { signal: preloadListeners.signal })
  temporaryImage.addEventListener('error', preloadErrorHandler, { signal: preloadListeners.signal })

  // An image waiting only on a `<picture>` source keeps its own sources as the
  // fallback, so the preload settles even when no source matches.
  const isOwnSourcePending = hasOwnPendingSource(image)
  const temporarySrcset = isOwnSourcePending
    ? dataSrcset
    : image.getAttribute('srcset')
  const temporarySrc = isOwnSourcePending
    ? dataSrc
    : image.getAttribute('src')
  if (temporarySrcset)
    temporaryImage.srcset = temporarySrcset
  if (temporarySrc)
    temporaryImage.src = temporarySrc

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

function hasPendingSource(image: HTMLImageElement): boolean {
  return hasOwnPendingSource(image)
    || (isDescendantOfPicture(image) && Boolean(image.parentElement.querySelector('source[data-srcset]')))
}

function hasOwnPendingSource(image: HTMLImageElement): boolean {
  return Boolean(image.dataset.src || image.dataset.srcset)
}

function swapSources(image: HTMLImageElement): void {
  const hasSwappedPictureSources = swapPictureSources(image)
  const hasSwappedSrcset = swapDataAttribute(image, 'srcset')
  const hasSwappedSrc = swapDataAttribute(image, 'src')
  if (!hasSwappedPictureSources && !hasSwappedSrcset && !hasSwappedSrc)
    return

  // Tracked apart from the callback listeners, which a cleanup detaches.
  swapStates.set(image, 'pending')
  const settleListeners = new AbortController()
  const settleHandler = () => {
    settleListeners.abort()
    swapStates.set(image, 'settled')
  }
  image.addEventListener('load', settleHandler, { signal: settleListeners.signal })
  image.addEventListener('error', settleHandler, { signal: settleListeners.signal })
}

function swapDataAttribute(
  element: HTMLImageElement | HTMLSourceElement,
  attr: 'src' | 'srcset',
): boolean {
  const value = element.dataset[attr]
  if (!value)
    return false

  element[attr] = value
  element.removeAttribute(`data-${attr}`)
  return true
}

function swapPictureSources(image: HTMLImageElement): boolean {
  const picture = image.parentElement
  if (picture?.tagName.toLowerCase() !== 'picture')
    return false

  let hasSwapped = false
  for (const source of picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]')) {
    // Resolve `data-sizes="auto"` to a numeric pixel width before swapping
    // `srcset` so the browser sees a final value at source-selection time.
    updateSizesAttribute(source)
    if (swapDataAttribute(source, 'srcset'))
      hasSwapped = true
  }
  return hasSwapped
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
