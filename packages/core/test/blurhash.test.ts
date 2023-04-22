import { describe, expect, test } from 'vitest'
import { createPngDataUri as createPngDataUriBlurHash } from '../src/formats/blurhash'
import { createPngDataUri as createPngDataUriThumbHash } from '../src/formats/thumbhash'

describe('Blurhash to PNG Data URI', () => {
  test('generates a valid PNG data URL from a Blurhash', () => {
    const hash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
    const dataURL = createPngDataUriBlurHash(hash)
    expect(dataURL).toMatchSnapshot()
  })
})

describe('ThumbHash to PNG Data URI', () => {
  test('generates a valid PNG data URL from a ThumbHash', () => {
    const hash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
    const dataURL = createPngDataUriThumbHash(hash)
    expect(dataURL).toMatchSnapshot()
  })
})
