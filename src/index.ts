export const isCrawler = !('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)

export function lazyLoadImages(
  /**
   * A CSS selector or a list of CSS selectors to match images to lazy load.
   *
   * @default 'img[loading="lazy"]'
   */
  selectors = 'img[loading="lazy"]',
  /**
   * A callback function to run when an image is loaded.
   */
  onLoad?: (image: HTMLImageElement) => void,
) {
  for (const image of [...document.querySelectorAll<HTMLImageElement>(selectors)]) {
    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    updateSizesAttribute(image)

    // Bail if the image doesn't contain a blurry placeholder
    if (!image.dataset.srcset)
      continue

    if (isCrawler) {
      // Let the crawler load the image
      updatePictureSources(image)
      updateImageSrcset(image)
      onLoad?.(image)
      continue
    }

    if (image.complete && image.naturalWidth > 0) {
      // Load the image if it's already in the viewport
      loadImage(image, onLoad)
      continue
    }

    // Otherwise, load the image when it enters the viewport
    image.addEventListener('load', () => loadImage(image, onLoad), { once: true })
  }
}

export function autoSizes(
  /**
   * A CSS selector or a list of CSS selectors to calculate the `sizes` attribute for.
   *
   * @default 'img[data-sizes="auto"], source[data-sizes="auto"]'
   */
  selectors = 'img[data-sizes="auto"], source[data-sizes="auto"]',
) {
  for (const image of [...document.querySelectorAll<HTMLImageElement | HTMLSourceElement>(selectors)])
    updateSizesAttribute(image)
}

export function loadImage(
  image: HTMLImageElement,
  onLoad?: (image: HTMLImageElement) => void,
) {
  const imageLoader = new Image()
  imageLoader.srcset = image.dataset.srcset!
  imageLoader.sizes = image.sizes

  imageLoader.addEventListener('load', () => {
    updatePictureSources(image)
    updateImageSrcset(image)
    onLoad?.(image)
  })
}

export default Object.freeze({
  isCrawler,
  lazyLoadImages,
  autoSizes,
  loadImage,
})

// Automatically initiate if `init` attribute is present
let s
// eslint-disable-next-line no-cond-assign
if ((s = document.currentScript) && s.hasAttribute('init'))
  lazyLoadImages()

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

function updateImageSrcset(image: HTMLImageElement | HTMLSourceElement) {
  image.srcset = image.dataset.srcset!
  image.removeAttribute('data-srcset')
}

function updatePictureSources(image: HTMLImageElement) {
  const picture = image.parentElement as HTMLPictureElement

  if (picture?.tagName.toLowerCase() === 'picture')
    [...picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]')].forEach(updateImageSrcset)
}
