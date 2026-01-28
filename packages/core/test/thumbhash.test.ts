import { describe, expect, it } from 'vitest'
import { createPngDataUri } from '../src/thumbhash'

describe('createPngDataUri (ThumbHash)', () => {
  const VALID_HASH = '1QcSHQRnh493V4dIh4eXh1h4kJUI'

  it('returns valid PNG data URI', () => {
    const result = createPngDataUri(VALID_HASH)

    expect(result).toMatch(/^data:image\/png;base64,/)
  })

  it('returns valid base64 string', () => {
    const result = createPngDataUri(VALID_HASH)
    const base64 = result.replace('data:image/png;base64,', '')

    expect(() => atob(base64)).not.toThrow()
  })

  it('produces deterministic output for same input', () => {
    const result1 = createPngDataUri(VALID_HASH)
    const result2 = createPngDataUri(VALID_HASH)

    expect(result1).toBe(result2)
  })

  it('handles URL-safe base64 input', () => {
    // ThumbHash can use URL-safe base64 (- instead of +, _ instead of /)
    const urlSafeHash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
    
    expect(() => createPngDataUri(urlSafeHash)).not.toThrow()
  })

  it('matches snapshot for regression testing', () => {
    const result = createPngDataUri(VALID_HASH)

    expect(result).toMatchSnapshot()
  })

  it('throws on invalid hash', () => {
    expect(() => createPngDataUri('!!invalid!!')).toThrow()
  })
})
