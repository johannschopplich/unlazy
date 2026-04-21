// Dev-mode only: warns when the Largest Contentful Paint element is still
// marked for lazy loading. Tree-shaken in production via `__UNLAZY_LOGGING__`.

interface LargestContentfulPaint extends PerformanceEntry {
  element: Element | null
}

let isInstalled = false

export function installLcpWarning(): void {
  if (isInstalled)
    return

  isInstalled = true

  try {
    const observer = new PerformanceObserver((entries) => {
      for (const entry of entries.getEntries()) {
        const element = (entry as LargestContentfulPaint).element as HTMLImageElement | null
        if (!element || element.tagName !== 'IMG')
          continue

        const isLazy = element.loading === 'lazy'
        const hasDataSrc = element.hasAttribute('data-src') || element.hasAttribute('data-srcset')

        if (isLazy || hasDataSrc) {
          console.warn(
            '[unlazy] LCP element is configured for lazy loading. '
            + 'Set `loading="eager"` to improve Largest Contentful Paint.',
            element,
          )
        }
      }
    })

    // Safari rejects this entry type until 16; catch the `NotSupportedError`
    // rather than feature-detect, since the type is Newly (not Widely) Available
    observer.observe({ type: 'largest-contentful-paint', buffered: true })
  }
  catch {
    // No-op: progressive enhancement
  }
}
