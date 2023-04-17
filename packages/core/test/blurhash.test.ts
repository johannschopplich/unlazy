import { describe, expect, test } from 'vitest'
import { createPngDataUriFromBlurHash, createSvgDataUriFromBlurHash } from '../src/blurhash'

describe('createSvgDataUriFromBlurHash', () => {
  test('should return a valid data URL', () => {
    const hash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
    const dataURL = createSvgDataUriFromBlurHash(hash)
    expect(dataURL).toMatchSnapshot()
  })
})

describe('createPngDataUriFromBlurHash', () => {
  test ('should return a valid data URL', () => {
    const hash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
    const dataURL = createPngDataUriFromBlurHash(hash)
    expect(dataURL).toMatchSnapshot()
  })
})
