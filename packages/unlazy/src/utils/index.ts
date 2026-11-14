export * from './png'

export const isSSR = typeof window === 'undefined'
export const isCrawler = !isSSR && (!('onscroll' in window) || isCrawlerUserAgent(navigator.userAgent))

export function isCrawlerUserAgent(userAgent: string): boolean {
  return /bot|crawl|spider/i.test(userAgent)
}

export function toElementArray<T extends HTMLElement>(
  target: string | T | NodeListOf<T> | T[],
  parentElement: Element | Document = document,
): T[] {
  if (typeof target === 'string') {
    return [
      ...parentElement.querySelectorAll<T>(target),
    ]
  }

  if (target instanceof Element)
    return [target]

  return [...target]
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
