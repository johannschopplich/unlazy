export function arrayToDataUri(array: Uint8ClampedArray, width: number, height: number): string {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = width
  canvas.height = height

  const imgData = ctx.createImageData(width, height)
  imgData.data.set(array)
  ctx.putImageData(imgData, 0, 0)

  return canvas.toDataURL()
}
