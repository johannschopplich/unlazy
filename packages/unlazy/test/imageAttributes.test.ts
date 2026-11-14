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

    expect(attributes.hasRealSources).toBe(false)
    expect(attributes.image).toEqual({
      'src': '/placeholder.jpg',
      'data-src': '/image.jpg',
      'data-srcset': '/image.jpg 1x',
      'data-sizes': 'auto',
      'loading': 'lazy',
    })
    expect(attributes.sources).toEqual([
      { 'type': 'image/webp', 'data-srcset': '/image.webp', 'data-sizes': 'auto' },
      { 'data-srcset': '/image.avif', 'data-sizes': '50vw' },
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

    expect(attributes.hasRealSources).toBe(true)
    expect(attributes.image).toEqual({ src: '/image.jpg', srcset: '/image.jpg 1x', loading: 'eager' })
    expect(attributes.sources).toEqual([
      { srcset: '/image.webp', sizes: '50vw' },
    ])
  })

  it.each([
    { autoSizes: true },
    { lazyLoad: false },
  ])('defers the sources of an eager image with %o', (options) => {
    expect(resolveImageAttributes({ src: '/image.jpg', loading: 'eager', ...options }).hasRealSources).toBe(false)
  })

  it('defaults loading to eager with lazyLoad set to false unless preload is set', () => {
    expect(resolveImageAttributes({ lazyLoad: false }).image.loading).toBe('eager')
    expect(resolveImageAttributes({ lazyLoad: false, preload: true }).image.loading).toBe('lazy')
  })

  it('prefers a ThumbHash over a BlurHash', () => {
    expect(resolveImageAttributes({ blurhash: 'blur', thumbhash: 'thumb' })).toMatchObject({ hash: 'thumb', hashType: 'thumbhash' })
    expect(resolveImageAttributes({ blurhash: 'blur' })).toMatchObject({ hash: 'blur', hashType: 'blurhash' })
  })
})
