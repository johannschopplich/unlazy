import { describe, expect, it } from 'vitest'
import { createPlaceholderFromHash } from '../src/lazyLoad'

const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const THUMBHASH = '1QcSHQRnh493V4dIh4eXh1h4kJUI'

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

  it('respects custom size option for blurhash', () => {
    const small = createPlaceholderFromHash({ hash: BLURHASH, hashType: 'blurhash', size: 16 })
    const large = createPlaceholderFromHash({ hash: BLURHASH, hashType: 'blurhash', size: 64 })

    expect(large!.length).toBeGreaterThan(small!.length)
  })

  it('respects custom ratio option for blurhash', () => {
    const square = createPlaceholderFromHash({ hash: BLURHASH, hashType: 'blurhash', ratio: 1 })
    const wide = createPlaceholderFromHash({ hash: BLURHASH, hashType: 'blurhash', ratio: 2 })

    expect(square).not.toBe(wide)
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
})
