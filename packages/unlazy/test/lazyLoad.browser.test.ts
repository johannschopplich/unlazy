import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { autoSizes, lazyLoad } from '../src/lazyLoad'
import { BLURHASH, createImageUrl, fetchImageRequests, makeLazyImg, makePictureImg, TINY_PNG } from './fixtures'

let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleError.mockRestore()
  document.body.innerHTML = ''
  window.scrollTo(0, 0)
})

describe('lazyLoad', () => {
  it('logs an error when image has neither data-src nor data-srcset', () => {
    const img = makeLazyImg()

    lazyLoad(img)

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Missing `data-src` or `data-srcset`'),
      img,
    )
  })

  it('ignores a native lazy image without data attributes by default', () => {
    const img = makeLazyImg()
    document.body.append(img)

    lazyLoad()

    expect(consoleError).not.toHaveBeenCalled()
    expect(img.hasAttribute('src')).toBe(false)
  })

  it('sets BlurHash placeholder on src when data-blurhash is present', () => {
    const img = makeLazyImg({ dataSrc: 'real.jpg', dataBlurhash: BLURHASH })

    lazyLoad(img)

    expect(img.src).toMatch(/^data:image\/png;base64,/)
  })

  it('preserves author-supplied src when no hash is set', () => {
    const img = makeLazyImg({ dataSrc: 'real.jpg' })
    img.src = 'data:image/webp;base64,AAAA'

    lazyLoad(img)

    expect(img.src).toBe('data:image/webp;base64,AAAA')
  })

  it('assigns a distinct placeholder src to each lazy image without a hash', () => {
    const a = makeLazyImg({ dataSrc: 'a.jpg' })
    const b = makeLazyImg({ dataSrc: 'b.jpg' })
    const c = makeLazyImg({ dataSrc: 'c.jpg' })

    lazyLoad([a, b, c])

    expect(a.src).not.toBe(b.src)
    expect(b.src).not.toBe(c.src)
    expect(a.src).not.toBe(c.src)
  })

  it('cleanup detaches the callbacks of a lazy image before they fire', async () => {
    const img = document.createElement('img')
    img.loading = 'lazy'
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)
    const onLoad = vi.fn()

    const cleanup = lazyLoad(img, { onImageLoad: onLoad })
    cleanup()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onLoad).not.toHaveBeenCalled()
  })

  it('cleanup cancels the in-flight preload of a lazy image', async () => {
    const img = document.createElement('img')
    img.loading = 'lazy'
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)
    const onLoad = vi.fn()

    const cleanup = lazyLoad(img, { onImageLoad: onLoad })

    // unlazy's load listener, registered first, starts the preload during the same dispatch.
    await new Promise<void>(resolve => img.addEventListener('load', () => resolve(), { once: true }))

    cleanup()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onLoad).not.toHaveBeenCalled()
  })

  describe('eager priority path', () => {
    it('swaps data-src immediately on eager images', () => {
      const img = makeLazyImg({ loading: 'eager', dataSrc: 'hero.jpg' })

      lazyLoad(img)

      expect(img.src).toContain('hero.jpg')
      expect(img.dataset.src).toBeUndefined()
    })

    it('sets fetchpriority="high" on eager images when absent', () => {
      const img = makeLazyImg({ loading: 'eager', dataSrc: 'hero.jpg' })

      lazyLoad(img)

      expect(img.getAttribute('fetchpriority')).toBe('high')
    })

    it('respects an explicit fetchpriority value on eager images', () => {
      const img = makeLazyImg({ loading: 'eager', dataSrc: 'hero.jpg', fetchpriority: 'low' })

      lazyLoad(img)

      expect(img.getAttribute('fetchpriority')).toBe('low')
    })

    it('leaves fetchpriority untouched on lazy images', () => {
      const img = makeLazyImg({ loading: 'lazy', dataSrc: 'image.jpg' })

      lazyLoad(img)

      expect(img.hasAttribute('fetchpriority')).toBe(false)
    })

    it('selects eager images with data-src by default and skips those without', () => {
      const eager = makeLazyImg({ loading: 'eager', dataSrc: 'eager.jpg' })
      const eagerNoData = makeLazyImg({ loading: 'eager' })
      document.body.append(eager, eagerNoData)

      lazyLoad()

      expect(eager.getAttribute('fetchpriority')).toBe('high')
      expect(eager.src).toContain('eager.jpg')
      // Image without `data-src` is not in the selector, left untouched.
      expect(eagerNoData.hasAttribute('fetchpriority')).toBe(false)
    })

    it('populates numeric sizes on data-sizes="auto" sources for eager picture-wrapped images', () => {
      const { img, sources } = makePictureImg({
        loading: 'eager',
        dataSrc: 'hero.jpg',
        sources: [
          { dataSrcset: 'hero.webp', type: 'image/webp', dataSizes: 'auto' },
        ],
      })
      const [source] = sources as [HTMLSourceElement]
      Object.defineProperty(img, 'offsetWidth', { value: 1200, configurable: true })

      lazyLoad(img)

      expect(source.srcset).toBe('hero.webp')
      expect(source.sizes).toBe('1200px')
    })

    it('invokes onImageLoad for eager images', async () => {
      const img = document.createElement('img')
      img.loading = 'eager'
      img.dataset.src = TINY_PNG
      document.body.appendChild(img)

      await new Promise<void>(resolve => lazyLoad(img, {
        onImageLoad: () => resolve(),
      }))

      expect(img.src).toBe(TINY_PNG)
      expect(img.dataset.src).toBeUndefined()
    }, 2000)

    it('ignores an error of a later source once an eager image has loaded', async () => {
      const img = document.createElement('img')
      img.loading = 'eager'
      img.dataset.src = TINY_PNG
      document.body.appendChild(img)
      const onImageError = vi.fn()

      await new Promise<void>(resolve => lazyLoad(img, {
        onImageLoad: () => resolve(),
        onImageError,
      }))
      await new Promise((resolve) => {
        img.addEventListener('error', resolve, { once: true })
        img.src = createImageUrl({ status: '404' })
      })

      expect(onImageError).not.toHaveBeenCalled()
    }, 2000)

    it('cleanup detaches eager-priority callbacks before they fire', async () => {
      const img = document.createElement('img')
      img.loading = 'eager'
      img.dataset.src = TINY_PNG
      document.body.appendChild(img)

      const onLoad = vi.fn()
      const cleanup = lazyLoad(img, { onImageLoad: onLoad })
      cleanup()

      await new Promise(resolve => setTimeout(resolve, 200))

      expect(onLoad).not.toHaveBeenCalled()
    })
  })

  it('keeps off-screen images unfetched beside a loaded image with the same hash and box until they scroll into view', async () => {
    const loadedImage = makeLazyImg({
      dataSrc: createImageUrl(),
      dataBlurhash: BLURHASH,
      width: 30,
      height: 20,
    })
    document.body.append(loadedImage)
    await new Promise<void>(resolve => lazyLoad(loadedImage, {
      onImageLoad: () => resolve(),
    }))

    const spacer = document.createElement('div')
    spacer.style.height = '10000px'
    const urls = [
      createImageUrl(),
      createImageUrl(),
      createImageUrl(),
    ]
    const images = urls.map(url => makeLazyImg({
      dataSrc: url,
      dataBlurhash: BLURHASH,
      width: 30,
      height: 20,
    }))
    document.body.append(spacer, ...images)
    const loads = images.map(image => new Promise<void>(resolve => lazyLoad(image, {
      onImageLoad: () => resolve(),
    })))
    await new Promise(resolve => setTimeout(resolve, 300))
    const requestCounts = await Promise.all(urls.map(async url => (await fetchImageRequests(url)).length))

    expect(requestCounts).toEqual([0, 0, 0])

    images[0]!.scrollIntoView()
    await Promise.all(loads)
  }, 5000)
})

describe('autoSizes', () => {
  it('sets sizes to rendered width for img with data-sizes="auto"', () => {
    const img = document.createElement('img')
    img.dataset.sizes = 'auto'
    Object.defineProperty(img, 'offsetWidth', { value: 800, configurable: true })

    autoSizes(img)

    expect(img.sizes).toBe('800px')
  })

  it('resolves source element sizes via parent picture img', () => {
    const picture = document.createElement('picture')
    const source = document.createElement('source')
    source.dataset.sizes = 'auto'
    const img = document.createElement('img')
    Object.defineProperty(img, 'offsetWidth', { value: 600, configurable: true })
    picture.append(source, img)

    autoSizes(source)

    expect(source.sizes).toBe('600px')
  })
})

describe('autoSizes resize tracking', () => {
  let observers: Array<{ cb: ResizeObserverCallback, target: Element | null }>

  beforeEach(() => {
    vi.useFakeTimers()
    observers = []
    vi.stubGlobal('ResizeObserver', class FakeRO {
      record: { cb: ResizeObserverCallback, target: Element | null }
      constructor(cb: ResizeObserverCallback) {
        this.record = { cb, target: null }
        observers.push(this.record)
      }

      observe(target: Element) { this.record.target = target }
      unobserve() { this.record.target = null }
      disconnect() { this.record.target = null }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  function fireResize(target: Element) {
    for (const o of observers) {
      if (o.target === target)
        o.cb([] as unknown as ResizeObserverEntry[], {} as ResizeObserver)
    }
  }

  it('retracks picture source sizes on viewport resize when updateOnResize is enabled', () => {
    const { picture, img, sources } = makePictureImg({
      dataSrc: 'image.jpg',
      sources: [
        { dataSrcset: 'image.webp', type: 'image/webp', dataSizes: 'auto' },
      ],
    })
    document.body.append(picture)
    const [source] = sources as [HTMLSourceElement]
    Object.defineProperty(img, 'offsetWidth', { value: 800, configurable: true })

    autoSizes(img, { updateOnResize: true })
    expect(source.sizes).toBe('800px')

    Object.defineProperty(img, 'offsetWidth', { value: 1200, configurable: true })
    fireResize(img)
    vi.advanceTimersByTime(500)

    expect(source.sizes).toBe('1200px')
  })

  it('stops retracking source sizes after the autoSizes cleanup runs', () => {
    const { picture, img, sources } = makePictureImg({
      dataSrc: 'image.jpg',
      sources: [
        { dataSrcset: 'image.webp', type: 'image/webp', dataSizes: 'auto' },
      ],
    })
    document.body.append(picture)
    const [source] = sources as [HTMLSourceElement]
    Object.defineProperty(img, 'offsetWidth', { value: 800, configurable: true })

    const cleanup = autoSizes(img, { updateOnResize: true })
    cleanup()

    Object.defineProperty(img, 'offsetWidth', { value: 1200, configurable: true })
    fireResize(img)
    vi.advanceTimersByTime(500)

    expect(source.sizes).toBe('800px')
  })

  it('retracks source sizes on resize for eager picture-wrapped images via lazyLoad', () => {
    const { picture, img, sources } = makePictureImg({
      loading: 'eager',
      dataSrc: 'image.jpg',
      sources: [
        { dataSrcset: 'image.webp', type: 'image/webp', dataSizes: 'auto' },
      ],
    })
    document.body.append(picture)
    const [source] = sources as [HTMLSourceElement]
    Object.defineProperty(img, 'offsetWidth', { value: 800, configurable: true })

    lazyLoad(img, { updateSizesOnResize: true })
    expect(source.sizes).toBe('800px')

    Object.defineProperty(img, 'offsetWidth', { value: 1200, configurable: true })
    fireResize(img)
    vi.advanceTimersByTime(500)

    expect(source.sizes).toBe('1200px')
  })

  it('retracks standalone img sizes on resize when data-sizes="auto" is set', () => {
    const img = makeLazyImg({ dataSrcset: 'image.jpg 1x, image@2x.jpg 2x', dataSizes: 'auto' })
    document.body.append(img)
    Object.defineProperty(img, 'offsetWidth', { value: 600, configurable: true })

    autoSizes(img, { updateOnResize: true })
    expect(img.sizes).toBe('600px')

    Object.defineProperty(img, 'offsetWidth', { value: 900, configurable: true })
    fireResize(img)
    vi.advanceTimersByTime(500)

    expect(img.sizes).toBe('900px')
  })
})
