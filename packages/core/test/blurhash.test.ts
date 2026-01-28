import { describe, expect, it } from 'vitest'
import { createPngDataUri } from '../src/blurhash'

describe('createPngDataUri (BlurHash)', () => {
  const VALID_HASH = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'

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

  it('respects aspect ratio option', () => {
    const square = createPngDataUri(VALID_HASH, { ratio: 1 })
    const wide = createPngDataUri(VALID_HASH, { ratio: 2 })

    // Different ratios should produce different outputs
    expect(square).not.toBe(wide)
  })

  it('respects size option', () => {
    const small = createPngDataUri(VALID_HASH, { size: 16 })
    const large = createPngDataUri(VALID_HASH, { size: 64 })

    // Larger size = longer base64 string
    expect(large.length).toBeGreaterThan(small.length)
  })

  it('defaults to size 32 when size option omitted', () => {
    const withDefault = createPngDataUri(VALID_HASH)
    const withExplicit = createPngDataUri(VALID_HASH, { size: 32 })

    expect(withDefault).toBe(withExplicit)
  })

  it('matches snapshot', () => {
    const result = createPngDataUri(VALID_HASH)

    expect(result).toMatchSnapshot()
  })

  it('handles invalid hash gracefully', () => {
    // fast-blurhash doesn't throw on invalid input, it produces garbage output
    // This is expected behavior - validation happens at the application level
    const result = createPngDataUri('invalid')

    expect(result).toMatch(/^data:image\/png;base64,/)
  })
})
