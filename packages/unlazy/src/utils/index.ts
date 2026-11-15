export * from './png'

export const isSSR = typeof window === 'undefined'
export const isCrawler = !isSSR && (!('onscroll' in window) || isCrawlerUserAgent(navigator.userAgent))

export function isCrawlerUserAgent(userAgent: string): boolean {
  return /bot|crawl|spider/i.test(userAgent)
}

export function toElementArray<T extends HTMLElement>(
  target: string | T | NodeListOf<T> | T[],
): T[] {
  if (typeof target === 'string') {
    return [
      ...document.querySelectorAll<T>(target),
    ]
  }

  if (target instanceof Element)
    return [target]

  return [...target]
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let timeoutId: number | undefined

  const cancel = () => {
    clearTimeout(timeoutId)
    timeoutId = undefined
  }

  return Object.assign((...args: Parameters<T>) => {
    cancel()
    timeoutId = (setTimeout as Window['setTimeout'])(() => {
      timeoutId = undefined
      fn(...args)
    }, delay)
  }, { cancel })
}
