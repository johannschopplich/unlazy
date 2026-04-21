import { describe, expect, it } from 'vitest'
import { createPngDataUri } from '../src/thumbhash'
import { THUMBHASH } from './fixtures'

describe('createPngDataUri (ThumbHash)', () => {
  it('returns a PNG data URI with valid base64 payload', () => {
    const result = createPngDataUri(THUMBHASH)
    const base64 = result.replace('data:image/png;base64,', '')

    expect(result).toMatch(/^data:image\/png;base64,/)
    expect(() => atob(base64)).not.toThrow()
  })

  it('throws on invalid hash', () => {
    expect(() => createPngDataUri('!!invalid!!')).toThrow()
  })
})
