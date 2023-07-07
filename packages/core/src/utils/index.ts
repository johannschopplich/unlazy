/* eslint-disable n/prefer-global/buffer */
export const isSSR = typeof window === 'undefined'
export const isLazyLoadingSupported = !isSSR && 'loading' in HTMLImageElement.prototype
export const isCrawler = !isSSR && (!('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent))

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

export function getScaledDimensions(aspectRatio: number, referenceSize: number) {
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

export function base64ToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')

  const decodedData = typeof Buffer !== 'undefined'
    ? Buffer.from(base64, 'base64')
    : Uint8Array.from(atob(base64), char => char.charCodeAt(0))

  return new Uint8Array(decodedData)
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number,
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
}
