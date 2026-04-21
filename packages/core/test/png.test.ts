import { describe, expect, it } from 'vitest'
import { rgbaToDataUri } from '../src/utils/png'

describe('rgbaToDataUri', () => {
  function decodeToBytes(dataUri: string): Uint8Array {
    const base64 = dataUri.replace('data:image/png;base64,', '')
    const binary = atob(base64)
    return Uint8Array.from(binary, ch => ch.charCodeAt(0))
  }

  it('emits the PNG magic-bytes signature', () => {
    const pixels = new Uint8Array([255, 0, 0, 255])
    const bytes = decodeToBytes(rgbaToDataUri(1, 1, pixels))

    expect(Array.from(bytes.slice(0, 8))).toEqual([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
  })

  it('encodes width and height into the IHDR chunk', () => {
    const width = 4
    const height = 3
    const pixels = new Uint8Array(width * height * 4)
    const bytes = decodeToBytes(rgbaToDataUri(width, height, pixels))

    // IHDR width/height occupy 4 bytes each starting at offset 16
    const readUint32 = (offset: number) =>
      (bytes[offset]! << 24) | (bytes[offset + 1]! << 16) | (bytes[offset + 2]! << 8) | bytes[offset + 3]!

    expect(readUint32(16)).toBe(width)
    expect(readUint32(20)).toBe(height)
  })

  it('ends with the IEND chunk', () => {
    const pixels = new Uint8Array([0, 0, 0, 0])
    const bytes = decodeToBytes(rgbaToDataUri(1, 1, pixels))
    const tail = bytes.slice(-8)

    // IEND chunk: length=0, type="IEND", CRC=0xAE426082
    expect(Array.from(tail)).toEqual([0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82])
  })
})
