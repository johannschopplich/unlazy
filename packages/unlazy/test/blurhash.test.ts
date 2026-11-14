import { describe, expect, it } from 'vitest'
import { createPngDataUri } from '../src/blurhash'
import { BLURHASH } from './fixtures'

describe('createPngDataUri (BlurHash)', () => {
  it('returns a PNG data URI with valid base64 payload', () => {
    const result = createPngDataUri(BLURHASH)
    const base64 = result.replace('data:image/png;base64,', '')

    expect(result).toMatch(/^data:image\/png;base64,/)
    expect(() => atob(base64)).not.toThrow()
  })

  it('caps a size of 200 at the longest edge the encoder supports', () => {
    const base64 = createPngDataUri(BLURHASH, { size: 200, ratio: 2 }).replace('data:image/png;base64,', '')
    const bytes = Uint8Array.from(atob(base64), character => character.charCodeAt(0))
    const view = new DataView(bytes.buffer)

    // The IHDR chunk stores width and height as 32-bit integers from byte 16.
    expect([
      view.getUint32(16),
      view.getUint32(20),
    ]).toEqual([100, 50])
  })
})
