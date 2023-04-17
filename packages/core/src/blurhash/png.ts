import { getCrcTable } from './crc'

// PNG generation below adapted from:
// https://github.com/wheany/js-png-encoder/blob/master/generatepng.js

const DEFLATE_METHOD = String.fromCharCode(0x78, 0x01)
const CRC_TABLE = getCrcTable()
const SIGNATURE = String.fromCharCode(137, 80, 78, 71, 13, 10, 26, 10)
const NO_FILTER = String.fromCharCode(0)
const IEND = createChunk(0, 'IEND', '')

export function getPngFromRgbaArr(rgba: Uint8ClampedArray, width: number, height: number) {
  const IHDR = createIHDRChunk(width, height)
  let scanlines = ''

  for (let y = 0; y < rgba.length; y += width * 4) {
    scanlines += NO_FILTER

    for (let x = 0; x < width * 4; x++)
      scanlines += String.fromCharCode(rgba[y + x] & 0xFF)
  }

  const compressedScanlines = DEFLATE_METHOD + inflateStore(scanlines) + dwordToString(calcAdler32Checksum(scanlines))
  const IDAT = createChunk(
    compressedScanlines.length,
    'IDAT',
    compressedScanlines,
  )

  return SIGNATURE + IHDR + IDAT + IEND
}

function createChunk(length: number, type: string, data: string) {
  const CRC = calcCrc32(type + data)
  return dwordToString(length) + type + data + dwordToString(CRC)
}

function createIHDRChunk(width: number, height: number) {
  const IHDRdata = dwordToString(width)
    + dwordToString(height)
    // bit depth
    + String.fromCharCode(8)
    // color type: 6=truecolor with alpha
    + String.fromCharCode(6)
    // compression method: 0=deflate, only allowed value
    + String.fromCharCode(0)
    // filtering: 0=adaptive, only allowed value
    + String.fromCharCode(0)
    // interlacing: 0=none
    + String.fromCharCode(0)

  return createChunk(13, 'IHDR', IHDRdata)
}

function inflateStore(data: string) {
  const MAX_STORE_LENGTH = 65535
  let storeBuffer = ''
  let remaining
  let blockType

  for (let i = 0; i < data.length; i += MAX_STORE_LENGTH) {
    remaining = data.length - i
    blockType = ''

    if (remaining <= MAX_STORE_LENGTH) {
      blockType = String.fromCharCode(0x01)
    }
    else {
      remaining = MAX_STORE_LENGTH
      blockType = String.fromCharCode(0x00)
    }

    // little-endian
    storeBuffer += blockType + String.fromCharCode(remaining & 0xFF, (remaining & 0xFF00) >>> 8)
    storeBuffer += String.fromCharCode(~remaining & 0xFF, (~remaining & 0xFF00) >>> 8)

    storeBuffer += data.substring(i, i + remaining)
  }

  return storeBuffer
}

function calcAdler32Checksum(data: string) {
  const MOD_ADLER = 65521
  let a = 1
  let b = 0

  for (let i = 0; i < data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD_ADLER
    b = (b + a) % MOD_ADLER
  }

  return (b << 16) | a
}

function calcCrc32(buf: string) {
  return updateCrc32(0xFFFFFFFF, buf) ^ 0xFFFFFFFF
}

function updateCrc32(crc: number, buf: string) {
  let c = crc
  let b: number

  for (let n = 0; n < buf.length; n++) {
    b = buf.charCodeAt(n)
    c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8)
  }

  return c
}

function dwordToString(dword: number) {
  return String.fromCharCode(
    (dword & 0xFF000000) >>> 24,
    (dword & 0x00FF0000) >>> 16,
    (dword & 0x0000FF00) >>> 8,
    dword & 0x000000FF,
  )
}
