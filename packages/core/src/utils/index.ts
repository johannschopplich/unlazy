import { DEFAULT_IMAGE_PLACEHOLDER } from '../constants'

export const isSSR = typeof window === 'undefined'
export const isLazyLoadingSupported = !isSSR && 'loading' in HTMLImageElement.prototype
export const isCrawler = !isSSR && (!('onscroll' in window) || /(?:gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent))

export function toElementArray<T extends HTMLElement>(
  target: string | T | NodeListOf<T> | T[],
  parentElement: Element | Document = document,
): T[] {
  if (typeof target === 'string')
    return [...parentElement.querySelectorAll<T>(target)]

  if (target instanceof Element)
    return [target]

  return [...target]
}

export function createIndexedImagePlaceholder(index: number) {
  return DEFAULT_IMAGE_PLACEHOLDER.replace('data-i=\'\'', `data-i='${index}'`)
}

export function calculateAspectRatioDimensions(aspectRatio: number, referenceSize: number) {
  const isLandscapeOrSquare = aspectRatio >= 1

  return {
    width: isLandscapeOrSquare
      ? referenceSize
      : Math.round(referenceSize * aspectRatio),
    height: isLandscapeOrSquare
      ? Math.round(referenceSize / aspectRatio)
      : referenceSize,
  }
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
) {
  let timeoutId: number | undefined

  return function (...args: Parameters<T>) {
    if (timeoutId != null)
      clearTimeout(timeoutId)

    timeoutId = (setTimeout as Window['setTimeout'])(() => {
      fn(...args)
      timeoutId = undefined
    }, delay)
  }
}
