import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { createPlaceholderFromHash } from '../src/lazyLoad'
import { createPngDataUri as createPngDataUriFromThumbHash } from '../src/thumbhash'
import { BLURHASH, THUMBHASH } from './fixtures'

describe('createPlaceholderFromHash', () => {
  it('generates PNG data URI from explicit ThumbHash', () => {
    const result = createPlaceholderFromHash({
      hash: THUMBHASH,
      hashType: 'thumbhash',
    })

    expect(result).toBe(createPngDataUriFromThumbHash(THUMBHASH))
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

  it('decodes a square placeholder for a hidden image with only a width', () => {
    const container = document.createElement('div')
    container.hidden = true
    const img = document.createElement('img')
    img.width = 800
    img.dataset.blurhash = BLURHASH
    container.append(img)
    document.body.append(container)

    const placeholder = createPlaceholderFromHash({ image: img })
    container.remove()
    const base64 = placeholder!.replace('data:image/png;base64,', '')
    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0))
    const view = new DataView(bytes.buffer)

    // The IHDR chunk stores width and height as 32-bit integers from byte 16.
    expect([
      view.getUint32(16),
      view.getUint32(20),
    ]).toEqual([32, 32])
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

  it('logs an error and returns undefined when decoder throws', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    onTestFinished(() => consoleError.mockRestore())

    const result = createPlaceholderFromHash({ hash: '!!invalid!!', hashType: 'thumbhash' })

    expect(result).toBeUndefined()
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('Failed to generate thumbhash placeholder'),
      expect.anything(),
    )
  })
})
