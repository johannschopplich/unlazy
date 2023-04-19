export const isSSR = typeof window === 'undefined'
export const isLazyLoadingSupported = !isSSR && 'loading' in HTMLImageElement.prototype
export const isCrawler = !isSSR && (!('onscroll' in window) || /(gle|ing|ro)bot|crawl|spider/i.test(navigator.userAgent))

export function toElementsArr<T extends HTMLElement>(
  target: string | T | NodeListOf<T> | T[],
  parentElement: Element | Document = document,
): T[] {
  if (typeof target === 'string')
    return [...parentElement.querySelectorAll<T>(target)]

  if (target instanceof Element)
    return [target]

  return [...target]
}

export function calculateDimensions(aspectRatio: number, referenceSize: number) {
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

export function getDataUriFromArr(arr: Uint8ClampedArray, w: number, h: number) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = w
  canvas.height = h

  const imgData = ctx.createImageData(w, h)
  imgData.data.set(arr)
  ctx.putImageData(imgData, 0, 0)

  return canvas.toDataURL()
}
