export const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
export const THUMBHASH = '1QcSHQRnh493V4dIh4eXh1h4kJUI'

export function makeLazyImg(options: {
  dataSrc?: string
  dataSrcset?: string
  dataSizes?: string
  loading?: 'lazy' | 'eager'
  dataBlurhash?: string
  dataThumbhash?: string
  fetchpriority?: 'high' | 'low' | 'auto'
  width?: number
  height?: number
} = {}): HTMLImageElement {
  const img = document.createElement('img')

  img.loading = options.loading ?? 'lazy'

  if (options.dataSrc !== undefined)
    img.dataset.src = options.dataSrc

  if (options.dataSrcset !== undefined)
    img.dataset.srcset = options.dataSrcset

  if (options.dataSizes !== undefined)
    img.dataset.sizes = options.dataSizes

  if (options.dataBlurhash !== undefined)
    img.dataset.blurhash = options.dataBlurhash

  if (options.dataThumbhash !== undefined)
    img.dataset.thumbhash = options.dataThumbhash

  if (options.fetchpriority !== undefined)
    img.setAttribute('fetchpriority', options.fetchpriority)

  if (options.width !== undefined)
    img.width = options.width

  if (options.height !== undefined)
    img.height = options.height

  return img
}

export function makePictureImg(options: {
  dataSrc?: string
  sources?: { dataSrcset: string, type?: string }[]
  loading?: 'lazy' | 'eager'
} = {}): {
  picture: HTMLPictureElement
  img: HTMLImageElement
  sources: HTMLSourceElement[]
} {
  const picture = document.createElement('picture')
  const sources = (options.sources ?? []).map(({ dataSrcset, type }) => {
    const source = document.createElement('source')
    source.dataset.srcset = dataSrcset

    if (type)
      source.type = type

    picture.appendChild(source)
    return source
  })

  const img = document.createElement('img')
  img.loading = options.loading ?? 'lazy'

  if (options.dataSrc !== undefined)
    img.dataset.src = options.dataSrc

  picture.appendChild(img)

  return {
    picture,
    img,
    sources,
  }
}
