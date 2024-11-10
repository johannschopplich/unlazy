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

export function calculateProportionalSize(aspectRatio: number, referenceSize: number) {
  let width: number
  let height: number

  if (aspectRatio >= 1) {
    width = referenceSize
    height = Math.round(referenceSize / aspectRatio)
  }
  else {
    width = Math.round(referenceSize * aspectRatio)
    height = referenceSize
  }

  return { width, height }
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
