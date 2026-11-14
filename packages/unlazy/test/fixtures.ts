export const BLURHASH = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
export const THUMBHASH = '1QcSHQRnh493V4dIh4eXh1h4kJUI'

// 1x1 transparent PNG.
export const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

export const IMAGE_ROUTE = '/__image__/'
export const IMAGE_REQUESTS_ROUTE = '/__image-requests__/'

export interface ImageRequest {
  referer: string | undefined
}

/**
 * Returns a fresh absolute URL served by the `imageServer` test plugin.
 */
export function createImageUrl(query: { status?: '404', failAfter?: string, delay?: string } = {}): string {
  const url = new URL(`${IMAGE_ROUTE}${crypto.randomUUID()}`, location.href)
  for (const [key, value] of Object.entries(query))
    url.searchParams.set(key, value)
  return url.href
}

/**
 * Lists the requests the `imageServer` test plugin received for a URL from `createImageUrl`.
 */
export async function fetchImageRequests(url: string): Promise<ImageRequest[]> {
  const id = new URL(url).pathname.slice(IMAGE_ROUTE.length)
  const response = await fetch(`${IMAGE_REQUESTS_ROUTE}${id}`)
  return response.json()
}

/**
 * Collects every later write to a `data-src` or `data-srcset` attribute below
 * `target`. Swapping them in removes them; an image rendered with its real
 * sources in the markup never has them.
 */
export function recordDataSourceWrites(target: Node): MutationRecord[] {
  const records: MutationRecord[] = []
  new MutationObserver(entries => records.push(...entries)).observe(target, {
    subtree: true,
    attributeFilter: ['data-src', 'data-srcset'],
  })
  return records
}

/**
 * Records every value the `src` attribute of `image` holds from now on, so a
 * test can tell whether a placeholder showed in between.
 *
 * @returns A function that lists the values held so far, the current one last
 */
export function recordSourceValues(image: HTMLImageElement): () => (string | null)[] {
  // Each record carries the value its write replaced.
  const replacedValues: (string | null)[] = []
  const collectReplacedValues = (records: MutationRecord[]) => {
    for (const record of records)
      replacedValues.push(record.oldValue)
  }
  const observer = new MutationObserver(collectReplacedValues)
  observer.observe(image, {
    attributeFilter: ['src'],
    attributeOldValue: true,
  })
  return () => {
    collectReplacedValues(observer.takeRecords())
    return [
      ...replacedValues,
      image.getAttribute('src'),
    ]
  }
}

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
  sources?: { dataSrcset: string, type?: string, dataSizes?: string }[]
  loading?: 'lazy' | 'eager'
} = {}): {
  picture: HTMLPictureElement
  img: HTMLImageElement
  sources: HTMLSourceElement[]
} {
  const picture = document.createElement('picture')
  const sources = (options.sources ?? []).map(({ dataSrcset, type, dataSizes }) => {
    const source = document.createElement('source')
    source.dataset.srcset = dataSrcset

    if (type)
      source.type = type

    if (dataSizes !== undefined)
      source.dataset.sizes = dataSizes

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
