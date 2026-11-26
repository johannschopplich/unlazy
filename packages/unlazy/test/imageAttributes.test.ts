import { describe, expect, it } from 'vitest'
import { resolveImageAttributes } from '../src/imageAttributes'

describe('resolveImageAttributes', () => {
  it('defers the sources of a lazy image to data attributes behind the placeholder', () => {
    const attributes = resolveImageAttributes({
      src: '/image.jpg',
      srcSet: '/image.jpg 1x',
      placeholderSrc: '/placeholder.jpg',
      sources: [
        { srcSet: '/image.webp', type: 'image/webp' },
        { srcSet: '/image.avif', sizes: '50vw' },
      ],
      autoSizes: true,
    })

    expect(attributes.image).toEqual({
      'src': '/placeholder.jpg',
      'data-src': '/image.jpg',
      'data-srcset': '/image.jpg 1x',
      'data-sizes': 'auto',
      'loading': 'lazy',
    })
    expect(attributes.sources).toEqual([
      { 'type': 'image/webp', 'data-srcset': '/image.webp', 'data-sizes': 'auto' },
      { 'data-srcset': '/image.avif', 'sizes': '50vw' },
    ])
  })

  it('keeps an explicit auto source size on the deferred auto-sizing path', () => {
    const { sources } = resolveImageAttributes({
      sources: [
        { srcSet: '/image.webp', sizes: 'auto' },
      ],
    })

    expect(sources).toEqual([
      { 'data-srcset': '/image.webp', 'data-sizes': 'auto' },
    ])
  })

  it('omits the src of a lazy image without placeholderSrc', () => {
    expect(resolveImageAttributes({ src: '/image.jpg' }).image).not.toHaveProperty('src')
  })

  it('keeps the real sources of an eager image without autoSizes', () => {
    const attributes = resolveImageAttributes({
      src: '/image.jpg',
      srcSet: '/image.jpg 1x',
      placeholderSrc: '/placeholder.jpg',
      sources: [
        { srcSet: '/image.webp', sizes: '50vw' },
      ],
      loading: 'eager',
    })

    expect(attributes.image).toEqual({ src: '/image.jpg', srcset: '/image.jpg 1x', loading: 'eager' })
    expect(attributes.sources).toEqual([
      { srcset: '/image.webp', sizes: '50vw' },
    ])
  })

  it.each([
    { autoSizes: true },
    { lazyLoad: false },
  ])('defers the sources of an eager image with %o', (options) => {
    expect(resolveImageAttributes({ src: '/image.jpg', loading: 'eager', ...options }).image).toHaveProperty('data-src', '/image.jpg')
  })

  it('defaults loading to eager with lazyLoad set to false unless preload is set', () => {
    expect(resolveImageAttributes({ lazyLoad: false }).image.loading).toBe('eager')
    expect(resolveImageAttributes({ lazyLoad: false, preload: true }).image.loading).toBe('lazy')
  })

  it('holds an image with lazyLoad set to false unless preload is set', () => {
    expect(resolveImageAttributes({ lazyLoad: false }).lazyLoadOptions.hold).toBe(true)
    expect(resolveImageAttributes({ lazyLoad: false, preload: true }).lazyLoadOptions.hold).toBe(false)
  })

  it('prefers a ThumbHash over a BlurHash', () => {
    expect(resolveImageAttributes({ blurhash: 'blur', thumbhash: 'thumb' }).lazyLoadOptions).toMatchObject({ hash: 'thumb', hashType: 'thumbhash' })
    expect(resolveImageAttributes({ blurhash: 'blur' }).lazyLoadOptions).toMatchObject({ hash: 'blur', hashType: 'blurhash' })
  })

  it('returns the lazyLoad options of the props', () => {
    expect(resolveImageAttributes({ placeholderSize: 64, autoSizes: true, preload: true }).lazyLoadOptions).toEqual({
      hash: undefined,
      hashType: 'blurhash',
      placeholderSize: 64,
      updateSizesOnResize: true,
      preload: true,
      hold: false,
    })
  })

  it('keeps the loadKey for an equal sources array and changes it for a new placeholderSize', () => {
    const { loadKey } = resolveImageAttributes({
      src: '/image.jpg',
      sources: [
        { srcSet: '/image.webp' },
      ],
    })

    expect(resolveImageAttributes({
      src: '/image.jpg',
      sources: [
        { srcSet: '/image.webp' },
      ],
    }).loadKey).toBe(loadKey)
    expect(resolveImageAttributes({
      src: '/image.jpg',
      sources: [
        { srcSet: '/image.webp' },
      ],
      placeholderSize: 64,
    }).loadKey).not.toBe(loadKey)
  })
})
