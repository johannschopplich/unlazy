import { afterEach, describe, expect, it, vi } from 'vitest'
import { autoSizes, lazyLoad, triggerLoad } from '../src/lazyLoad'

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const THUMBHASH = '1QcSHQRnh493V4dIh4eXh1h4kJUI'

describe('lazyLoad', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('returns a cleanup function', () => {
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'

    const cleanup = lazyLoad(img)

    expect(typeof cleanup).toBe('function')
    expect(() => cleanup()).not.toThrow()
  })

  it('logs an error when image has neither data-src nor data-srcset', () => {
    const img = document.createElement('img')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    lazyLoad(img)

    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Missing `data-src` or `data-srcset`'),
      img,
    )
    consoleError.mockRestore()
  })

  it('sets BlurHash placeholder on src when data-blurhash is present', () => {
    const img = document.createElement('img')
    img.dataset.src = 'real.jpg'
    img.dataset.blurhash = BLURHASH

    lazyLoad(img)

    expect(img.src).toMatch(/^data:image\/png;base64,/)
  })

  it('sets ThumbHash placeholder on src when data-thumbhash is present', () => {
    const img = document.createElement('img')
    img.dataset.src = 'real.jpg'
    img.dataset.thumbhash = THUMBHASH

    lazyLoad(img)

    expect(img.src).toMatch(/^data:image\/png;base64,/)
  })

  it('processes every image in an array', () => {
    const first = document.createElement('img')
    first.dataset.src = 'a.jpg'
    first.dataset.blurhash = BLURHASH
    const second = document.createElement('img')
    second.dataset.src = 'b.jpg'
    second.dataset.blurhash = BLURHASH

    lazyLoad([first, second])

    expect(first.src).toMatch(/^data:image\/png;base64,/)
    expect(second.src).toMatch(/^data:image\/png;base64,/)
  })

  it('uses default selector to find img[loading="lazy"] in document', () => {
    const lazy = document.createElement('img')
    lazy.loading = 'lazy'
    lazy.dataset.src = 'lazy.jpg'
    const eager = document.createElement('img')
    eager.dataset.src = 'eager.jpg'
    document.body.append(lazy, eager)

    lazyLoad()

    // lazy image gets the fallback indexed SVG placeholder; eager is untouched
    expect(lazy.src).toMatch(/^data:image\/svg\+xml/)
    expect(eager.src).toBe('')
  })
})

describe('autoSizes', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('sets sizes to rendered width for img with data-sizes="auto"', () => {
    const img = document.createElement('img')
    img.dataset.sizes = 'auto'
    Object.defineProperty(img, 'offsetWidth', { value: 800, configurable: true })

    autoSizes(img)

    expect(img.sizes).toBe('800px')
  })

  it('leaves sizes empty when data-sizes is not "auto"', () => {
    const img = document.createElement('img')
    Object.defineProperty(img, 'offsetWidth', { value: 800, configurable: true })

    autoSizes(img)

    expect(img.sizes).toBe('')
  })

  it('does nothing when offsetWidth is 0', () => {
    const img = document.createElement('img')
    img.dataset.sizes = 'auto'

    autoSizes(img)

    expect(img.sizes).toBe('')
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
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'
    picture.appendChild(img)

    triggerLoad(img)

    expect(img.src).toContain('image.jpg')
    expect(img.dataset.src).toBeUndefined()
  })

  it('swaps data-srcset to srcset for picture element child', () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.srcset = 'image-1x.jpg 1x, image-2x.jpg 2x'
    picture.appendChild(img)

    triggerLoad(img)

    expect(img.srcset).toBe('image-1x.jpg 1x, image-2x.jpg 2x')
    expect(img.dataset.srcset).toBeUndefined()
  })

  it('updates all source elements inside picture', () => {
    const picture = document.createElement('picture')
    const webpSource = document.createElement('source')
    webpSource.dataset.srcset = 'image.webp'
    const avifSource = document.createElement('source')
    avifSource.dataset.srcset = 'image.avif'
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'
    picture.append(avifSource, webpSource, img)

    triggerLoad(img)

    expect(webpSource.srcset).toBe('image.webp')
    expect(avifSource.srcset).toBe('image.avif')
    expect(img.src).toContain('image.jpg')
  })

  it('does not invoke onImageLoad for picture elements (no network load)', () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'
    picture.appendChild(img)
    const onLoad = vi.fn()

    triggerLoad(img, onLoad)

    expect(onLoad).not.toHaveBeenCalled()
  })

  it('does not invoke callbacks when no data attributes present', () => {
    const img = document.createElement('img')
    const onLoad = vi.fn()
    const onError = vi.fn()

    triggerLoad(img, onLoad, onError)

    expect(onLoad).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('preloads standalone image without throwing', () => {
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'

    expect(() => triggerLoad(img)).not.toThrow()
  })
})
