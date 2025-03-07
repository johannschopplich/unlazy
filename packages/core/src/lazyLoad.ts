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
    transition = 0,
    onImageLoad,
  }: UnLazyLoadOptions = {},
) {
  const cleanupHandlers = new Set<() => void>()

  for (const [index, image] of toElementArray<T>(selectorsOrElements).entries()) {
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
      loadImage(image, { transition, onImageLoad })
      continue
    }
    // Otherwise, load the image when it enters the viewport
    const loadHandler = () => loadImage(image, { transition, onImageLoad })
    image.addEventListener('load', loadHandler, { once: true })

    cleanupHandlers.add(() => image.removeEventListener('load', loadHandler))
  }

  return () => {
    for (const fn of cleanupHandlers) fn()
    cleanupHandlers.clear()
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
  options: UnLazyLoadOptions = {}
) {
  
  const { transition = 0, onImageLoad } = options
  const currentSrc = image.src

  // Skip preloading its `data-src` or `data-srcset` to avoid unnecessary requests
  if (isDescendantOfPicture(image)) {
    updatePictureSources(image)
    updateImageSrcset(image)
    updateImageSrc(image)
    onImageLoad?.(image)
    return
  }
  
  const temporaryImage = new Image()
  const { srcset: dataSrcset, src: dataSrc, sizes:dataSizes } = image.dataset
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
   
  temporaryImage.addEventListener('load', async () => {
    if (transition > 0 && currentSrc) {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const rect = image.getBoundingClientRect()
    
    // Fallback if canvas context is not available
    if (!ctx) {
      updateImageSrcset(image)
      updateImageSrc(image)
      onImageLoad?.(image)
      return
    }
    // Set canvas dimensions to match image
    canvas.width = rect.width
    canvas.height = rect.height
    canvas.style.cssText = `width:${rect.width}px;height:${rect.height}px`
    
    const [preFade, postFade] = await Promise.all([
      new Promise<HTMLImageElement>(resolve => {
        const img = new Image()
        img.src = currentSrc
        img.onload = () => resolve(img)
      }),
      new Promise<HTMLImageElement>(resolve => {
        const img = new Image()
        img.src = dataSrc ?? currentSrc
        img.onload = () => resolve(img)
      })
    ])
  
    image.replaceWith(canvas)
    // Animation timing variables
    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = (currentTime - startTime) / transition
      // Handles cross-fade transition between images using canvas, then restores final image
      if (progress < 1) {
        ctx.globalAlpha = 1
        ctx.drawImage(preFade, 0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = progress
        ctx.drawImage(postFade, 0, 0, canvas.width, canvas.height)
        requestAnimationFrame(animate)
      } else {
        canvas.replaceWith(image)
        updateImageSrcset(image)
        updateImageSrc(image)
        onImageLoad?.(image)
      }
    }

      requestAnimationFrame(animate)
    } else {
      updateImageSrcset(image)
      updateImageSrc(image)
      onImageLoad?.(image)
    }
  }, { once: true })

    if (dataSrcset) temporaryImage.srcset = dataSrcset
    if (dataSrc) temporaryImage.src = dataSrc
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

const resizeObserverCache = new WeakMap<HTMLImageElement | HTMLSourceElement, ResizeObserver>()

function updateSizesAttribute(
  element: HTMLImageElement | HTMLSourceElement,
  options?: {
    updateOnResize?: boolean
    processSourceElements?: boolean
  },
) {
  if (element.dataset.sizes !== 'auto')
    return

  const width = getOffsetWidth(element)

  if (width)
    element.sizes = `${width}px`

  // Calculate the `sizes` attribute for sources inside a `<picture>` element
  if (isDescendantOfPicture(element) && options?.processSourceElements) {
    for (const sourceElement of [...element.parentElement.getElementsByTagName('source')]) {
      updateSizesAttribute(sourceElement, { processSourceElements: true })
    }
  }

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
  const pictureElement = image.parentElement as HTMLPictureElement

  if (pictureElement?.tagName.toLowerCase() === 'picture') {
    [...pictureElement.querySelectorAll<HTMLSourceElement>('source[data-srcset]')].forEach(updateImageSrcset);
    [...pictureElement.querySelectorAll<HTMLSourceElement>('source[data-src]')].forEach(updateImageSrc)
  }
}

function getOffsetWidth(element: HTMLElement | HTMLSourceElement) {
  return element instanceof HTMLSourceElement
    ? element.parentElement?.getElementsByTagName('img')[0]?.offsetWidth
    : element.offsetWidth
}

function isDescendantOfPicture(element: HTMLElement): element is HTMLElement & { parentElement: HTMLPictureElement } {
  return element.parentElement?.tagName.toLowerCase() === 'picture'
}
