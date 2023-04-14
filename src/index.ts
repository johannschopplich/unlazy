export const isCrawler = !('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)

export function lazyLoad(
  /**
   * A CSS selector or a list of CSS selectors to match images to lazy load.
   *
   * @default 'img[loading="lazy"]'
   */
  selectors = 'img[loading="lazy"]',
) {
  const elements = [...document.querySelectorAll<HTMLImageElement>(selectors)]

  if (elements.length === 0)
    return

  for (const image of elements) {
    // Calculate the image's `sizes` attribute if `data-sizes="auto"` is set
    updateSizesAttribute(image)

    // Bail if the image doesn't contain a blurry placeholder
    if (!image.dataset.srcset)
      continue

    if (isCrawler) {
      // Let the crawler load the image
      image.srcset = image.dataset.srcset!
      image.removeAttribute('data-srcset')

      const picture = image.parentElement as HTMLPictureElement
      if (picture?.tagName.toLowerCase() === 'picture')
        updateSourceElements(picture)

      return
    }

    if (image.complete && image.naturalWidth > 0) {
      // Load the image if it's already in the viewport
      loadImage(image)
      return
    }

    // Otherwise, load the image when it enters the viewport
    image.addEventListener('load', () => loadImage(image), { once: true })
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
  const elements = [...document.querySelectorAll<HTMLImageElement | HTMLSourceElement>(selectors)]

  if (elements.length === 0)
    return

  for (const image of elements)
    updateSizesAttribute(image)
}

export default lazyLoad

// Automatically initiate if `init` attribute is present
let s
// eslint-disable-next-line no-cond-assign
if ((s = document.currentScript) && s.hasAttribute('init'))
  lazyLoad()

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

function updateSourceElements(picture: HTMLPictureElement) {
  const sources = picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]')

  for (const source of sources) {
    source.srcset = source.dataset.srcset!
    source.removeAttribute('data-srcset')
  }
}

function loadImage(element: HTMLImageElement) {
  const imageLoader = new Image()
  imageLoader.srcset = element.dataset.srcset!
  imageLoader.sizes = element.sizes

  imageLoader.addEventListener('load', () => {
    const picture = element.parentElement as HTMLPictureElement

    if (picture?.tagName.toLowerCase() === 'picture')
      updateSourceElements(picture)

    element.srcset = imageLoader.srcset
    element.removeAttribute('data-srcset')
  })
}
