import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as blurhashModule from '../src/blurhash'
import { autoSizes, lazyLoad, triggerLoad } from '../src/lazyLoad'
import { BLURHASH, makeLazyImg, makePictureImg, THUMBHASH } from './fixtures'

let consoleError: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  consoleError.mockRestore()
  document.body.innerHTML = ''
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

  it('sets BlurHash placeholder on src when data-blurhash is present', () => {
    const img = makeLazyImg({ dataSrc: 'real.jpg', dataBlurhash: BLURHASH })

    lazyLoad(img)

    expect(img.src).toMatch(/^data:image\/png;base64,/)
  })

  it('sets ThumbHash placeholder on src when data-thumbhash is present', () => {
    const img = makeLazyImg({ dataSrc: 'real.jpg', dataThumbhash: THUMBHASH })

    lazyLoad(img)

    expect(img.src).toMatch(/^data:image\/png;base64,/)
  })

  it('processes every image in an array', () => {
    const first = makeLazyImg({ dataSrc: 'a.jpg', dataBlurhash: BLURHASH })
    const second = makeLazyImg({ dataSrc: 'b.jpg', dataBlurhash: BLURHASH })

    lazyLoad([first, second])

    expect(first.src).toMatch(/^data:image\/png;base64,/)
    expect(second.src).toMatch(/^data:image\/png;base64,/)
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

    it('respects an explicit fetchpriority="high" on eager images', () => {
      const img = makeLazyImg({ loading: 'eager', dataSrc: 'hero.jpg', fetchpriority: 'high' })

      lazyLoad(img)

      expect(img.getAttribute('fetchpriority')).toBe('high')
    })

    it('leaves fetchpriority untouched on lazy images', () => {
      const img = makeLazyImg({ loading: 'lazy', dataSrc: 'image.jpg' })

      lazyLoad(img)

      expect(img.hasAttribute('fetchpriority')).toBe(false)
    })

    it('expanded default selector matches eager images with data-src', () => {
      const lazy = makeLazyImg({ loading: 'lazy', dataSrc: 'lazy.jpg' })
      const eager = makeLazyImg({ loading: 'eager', dataSrc: 'eager.jpg' })
      const eagerNoData = makeLazyImg({ loading: 'eager' })
      document.body.append(lazy, eager, eagerNoData)

      lazyLoad()

      expect(eager.getAttribute('fetchpriority')).toBe('high')
      expect(eager.src).toContain('eager.jpg')
      // Image without data-src is not in the selector, left untouched
      expect(eagerNoData.hasAttribute('fetchpriority')).toBe(false)
    })

    it('still generates the hash placeholder for eager images', () => {
      const spy = vi.spyOn(blurhashModule, 'createPngDataUri')

      const img = makeLazyImg({ loading: 'eager', dataSrc: 'hero.jpg', dataBlurhash: BLURHASH })
      lazyLoad(img)

      expect(spy).toHaveBeenCalled()
      // Final swap still wins: src ends up as the real image
      expect(img.src).toContain('hero.jpg')

      spy.mockRestore()
    })
  })

  describe('idempotency', () => {
    it('does not log missing-data-src error on re-invocation after processing', () => {
      const img = makeLazyImg({ loading: 'eager', dataSrc: 'hero.jpg' })

      lazyLoad(img)
      consoleError.mockClear()
      lazyLoad(img)

      expect(consoleError).not.toHaveBeenCalled()
    })

    it('does not re-process images with swapped data attributes', () => {
      const img = makeLazyImg({ loading: 'eager', dataSrc: 'hero.jpg' })

      lazyLoad(img)
      const srcAfterFirst = img.src
      lazyLoad(img)

      expect(img.src).toBe(srcAfterFirst)
    })
  })
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

describe('triggerLoad', () => {
  it('swaps data-src to src for picture element child', () => {
    const { img } = makePictureImg({ dataSrc: 'image.jpg' })

    triggerLoad(img)

    expect(img.src).toContain('image.jpg')
    expect(img.dataset.src).toBeUndefined()
  })

  it('swaps data-srcset to srcset for picture element child', () => {
    const { img } = makePictureImg()
    img.dataset.srcset = 'image-1x.jpg 1x, image-2x.jpg 2x'

    triggerLoad(img)

    expect(img.srcset).toBe('image-1x.jpg 1x, image-2x.jpg 2x')
    expect(img.dataset.srcset).toBeUndefined()
  })

  it('updates all source elements inside picture', () => {
    const { img, sources } = makePictureImg({
      dataSrc: 'image.jpg',
      sources: [
        { dataSrcset: 'image.avif', type: 'image/avif' },
        { dataSrcset: 'image.webp', type: 'image/webp' },
      ],
    })
    const [avifSource, webpSource] = sources as [HTMLSourceElement, HTMLSourceElement]

    triggerLoad(img)

    expect(webpSource.srcset).toBe('image.webp')
    expect(avifSource.srcset).toBe('image.avif')
    expect(img.src).toContain('image.jpg')
  })
})
