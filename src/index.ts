import {
  isCrawler,
  isLazyLoadingSupported,
  toElementsArray,
  updateImageSrcset,
  updatePictureSources,
  updateSizesAttribute,
} from './utils'

export function lazyLoadImages<T extends HTMLImageElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.
   *
   * @default 'img[loading="lazy"]'
   */
  selectorsOrElements: string | T | NodeListOf<T> | T[] = 'img[loading="lazy"]',
  /**
   * A callback function to run when an image is loaded.
   */
  onLoaded?: (image: HTMLImageElement) => void,
) {
  for (const image of toElementsArray<T>(selectorsOrElements)) {
    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    updateSizesAttribute(image)

    // Bail if the image doesn't contain a blurry placeholder
    if (!image.dataset.srcset)
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
    image.addEventListener('load', () => loadImage(image, onLoaded), { once: true })
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
  for (const image of toElementsArray<T>(selectorsOrElements))
    updateSizesAttribute(image)
}

export function loadImage(
  image: HTMLImageElement,
  onLoaded?: (image: HTMLImageElement) => void,
) {
  const imageLoader = new Image()
  imageLoader.srcset = image.dataset.srcset!
  imageLoader.sizes = image.sizes

  imageLoader.addEventListener('load', () => {
    updatePictureSources(image)
    updateImageSrcset(image)
    onLoaded?.(image)
  })
}

// Default export for IIFE bundle
export default Object.freeze({
  lazyLoadImages,
  autoSizes,
  loadImage,
})

// Automatically initiate if `init` attribute is present
let s
// eslint-disable-next-line no-cond-assign
if ((s = document.currentScript) && s.hasAttribute('init'))
  lazyLoadImages()
