import { describe, expect, test } from 'vitest'
import { createPngDataUri, createSvgDataUri } from '../src/blurhash'

describe('Blurhash to SVG Data URI', () => {
  test('generates a valid SVG data URL from a Blurhash', () => {
    const hash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
    const dataURL = createSvgDataUri(hash)
    expect(dataURL).toMatchSnapshot()
  })
})

describe('Blurhash to PNG Data URI', () => {
  test('generates a valid PNG data URL from a Blurhash', () => {
    const hash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
    const dataURL = createPngDataUri(hash)
    expect(dataURL).toMatchSnapshot()
  })
})
