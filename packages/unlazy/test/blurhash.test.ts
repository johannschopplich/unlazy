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
})
