export const isSSR = typeof window === 'undefined'
export const isLazyLoadingSupported = 'loading' in HTMLImageElement.prototype
export const isCrawler = !('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent)

export function updateSizesAttribute(element: HTMLImageElement | HTMLSourceElement) {
  const { sizes } = element.dataset
  if (sizes !== 'auto')
    return

  const width = element instanceof HTMLSourceElement
    ? element.parentElement?.offsetWidth
    : element.offsetWidth

  if (width)
    element.sizes = `${width}px`
}

export function updateImageSrcset(image: HTMLImageElement | HTMLSourceElement) {
  image.srcset = image.dataset.srcset!
  image.removeAttribute('data-srcset')
}

export function updatePictureSources(image: HTMLImageElement) {
  const picture = image.parentElement as HTMLPictureElement

  if (picture?.tagName.toLowerCase() === 'picture')
    [...picture.querySelectorAll<HTMLSourceElement>('source[data-srcset]')].forEach(updateImageSrcset)
}

export function toElementsArray<T extends HTMLElement>(
  target: string | T | NodeListOf<T> | T[],
  parentElement: Element | Document = document,
): T[] {
  if (typeof target === 'string')
    return [...parentElement.querySelectorAll<T>(target)]

  if (target instanceof Element)
    return [target]

  return [...target]
}
