import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createPlaceholderFromHash } from '../src/lazyLoad'
import { BLURHASH, THUMBHASH } from './fixtures'

describe('createPlaceholderFromHash', () => {
  it('generates PNG data URI from explicit BlurHash', () => {
    const result = createPlaceholderFromHash({
      hash: BLURHASH,
      hashType: 'blurhash',
    })

    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('generates PNG data URI from explicit ThumbHash', () => {
    const result = createPlaceholderFromHash({
      hash: THUMBHASH,
      hashType: 'thumbhash',
    })

    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('defaults to blurhash when hashType is omitted', () => {
    const result = createPlaceholderFromHash({ hash: BLURHASH })

    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('extracts hash from image data-blurhash attribute', () => {
    const img = document.createElement('img')
    img.dataset.blurhash = BLURHASH

    const result = createPlaceholderFromHash({ image: img })

    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('extracts hash from image data-thumbhash attribute', () => {
    const img = document.createElement('img')
    img.dataset.thumbhash = THUMBHASH

    const result = createPlaceholderFromHash({ image: img })

    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('prefers thumbhash over blurhash when image has both attributes', () => {
    const img = document.createElement('img')
    img.dataset.blurhash = BLURHASH
    img.dataset.thumbhash = THUMBHASH

    const result = createPlaceholderFromHash({ image: img })
    const thumbhashOnly = createPlaceholderFromHash({ hash: THUMBHASH, hashType: 'thumbhash' })

    expect(result).toBe(thumbhashOnly)
  })

  it('uses explicit hash over image data attributes', () => {
    const img = document.createElement('img')
    img.dataset.thumbhash = THUMBHASH

    const result = createPlaceholderFromHash({
      image: img,
      hash: BLURHASH,
      hashType: 'blurhash',
    })
    const blurhashOnly = createPlaceholderFromHash({ hash: BLURHASH, hashType: 'blurhash' })

    expect(result).toBe(blurhashOnly)
  })

  it('returns undefined when no hash provided', () => {
    const result = createPlaceholderFromHash({})

    expect(result).toBeUndefined()
  })

  it('returns undefined for image without hash attributes', () => {
    const img = document.createElement('img')

    const result = createPlaceholderFromHash({ image: img })

    expect(result).toBeUndefined()
  })

  describe('error handling', () => {
    let consoleError: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
      consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    })

    afterEach(() => {
      consoleError.mockRestore()
    })

    it('logs an error and returns undefined when decoder throws', () => {
      const result = createPlaceholderFromHash({ hash: '!!invalid!!', hashType: 'thumbhash' })

      expect(result).toBeUndefined()
      expect(consoleError).toHaveBeenCalledWith(
        expect.stringContaining('Failed to generate thumbhash placeholder'),
        expect.anything(),
      )
    })
  })
})
