import { describe, expect, it, vi } from 'vitest'
import { triggerLoad } from '../src/lazyLoad'
import { createImageUrl, makePictureImg, TINY_PNG } from './fixtures'

describe('triggerLoad', () => {
  function loadPicture(picture: HTMLPictureElement, img: HTMLImageElement): Promise<void> {
    document.body.append(picture)
    return new Promise(resolve => triggerLoad(img, {
      onImageLoad: () => resolve(),
    }))
  }

  it('invokes onImageLoad once for picture-wrapped images', async () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    // Real apps via `lazyLoad` set `image.src = placeholder` before `triggerLoad` runs.
    img.src = TINY_PNG
    picture.appendChild(img)
    document.body.appendChild(picture)

    const calls: string[] = []

    await new Promise<void>(resolve => triggerLoad(img, {
      onImageLoad: (image) => {
        calls.push(image.src)
        resolve()
      },
    }))

    expect(calls).toHaveLength(1)
    expect(img.dataset.src).toBeUndefined()
    expect(img.src).toBe(TINY_PNG)
  }, 2000)

  it('cleanup cancels an in-flight standalone preload', async () => {
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    const onImageLoad = vi.fn()
    const cleanup = triggerLoad(img, { onImageLoad })
    cleanup()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onImageLoad).not.toHaveBeenCalled()
  })

  it('tolerates calling cleanup twice', () => {
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    const cleanup = triggerLoad(img, {
      onImageLoad: vi.fn(),
    })
    cleanup()
    expect(() => cleanup()).not.toThrow()
  })

  it('swaps data-srcset to srcset for picture element child', async () => {
    const srcset = `${createImageUrl()} 1x, ${createImageUrl()} 2x`
    const { picture, img } = makePictureImg()
    img.dataset.srcset = srcset

    await loadPicture(picture, img)

    expect(img.srcset).toBe(srcset)
    expect(img.dataset.srcset).toBeUndefined()
  }, 2000)

  it('updates all source elements inside picture', async () => {
    const [avifUrl, webpUrl, url] = [
      createImageUrl(),
      createImageUrl(),
      createImageUrl(),
    ]
    const { picture, img, sources } = makePictureImg({
      dataSrc: url,
      sources: [
        { dataSrcset: avifUrl, type: 'image/avif' },
        { dataSrcset: webpUrl, type: 'image/webp' },
      ],
    })
    const [avifSource, webpSource] = sources as [HTMLSourceElement, HTMLSourceElement]

    await loadPicture(picture, img)

    expect(webpSource.srcset).toBe(webpUrl)
    expect(avifSource.srcset).toBe(avifUrl)
    expect(img.src).toBe(url)
  }, 2000)

  it('populates numeric sizes on data-sizes="auto" sources after lazy swap', async () => {
    const webpUrl = createImageUrl()
    const { picture, img, sources } = makePictureImg({
      dataSrc: createImageUrl(),
      sources: [
        { dataSrcset: webpUrl, type: 'image/webp', dataSizes: 'auto' },
      ],
    })
    const [source] = sources as [HTMLSourceElement]
    Object.defineProperty(img, 'offsetWidth', { value: 800, configurable: true })

    await loadPicture(picture, img)

    expect(source.srcset).toBe(webpUrl)
    expect(source.sizes).toBe('800px')
  }, 2000)

  it('preserves explicit source-level sizes when data-sizes is not "auto"', async () => {
    const webpUrl = createImageUrl()
    const { picture, img, sources } = makePictureImg({
      dataSrc: createImageUrl(),
      sources: [
        { dataSrcset: webpUrl, type: 'image/webp' },
      ],
    })
    const [source] = sources as [HTMLSourceElement]
    source.sizes = '50vw'

    await loadPicture(picture, img)

    expect(source.srcset).toBe(webpUrl)
    expect(source.sizes).toBe('50vw')
  }, 2000)
})
