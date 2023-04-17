const CRC_TABLE: number[] = []

export function getCrcTable() {
  if (CRC_TABLE.length === 0)
    makeCrcTable()

  return CRC_TABLE
}

function makeCrcTable() {
  let c: number

  for (let n = 0; n < 256; n++) {
    c = n

    for (let k = 0; k < 8; k++) {
      if (c & 1)
        c = 0xEDB88320 ^ (c >>> 1)
      else c = c >>> 1
    }

    CRC_TABLE[n] = c
  }
}
