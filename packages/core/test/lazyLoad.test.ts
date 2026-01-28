import { describe, expect, it, vi } from 'vitest'
import { loadImage } from '../src/lazyLoad'

describe('loadImage', () => {
  it('swaps data-src to src for picture element child', () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'
    picture.appendChild(img)

    loadImage(img)

    expect(img.src).toContain('image.jpg')
    expect(img.dataset.src).toBeUndefined()
  })

  it('swaps data-srcset to srcset for picture element child', () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.srcset = 'image-1x.jpg 1x, image-2x.jpg 2x'
    picture.appendChild(img)

    loadImage(img)

    expect(img.srcset).toBe('image-1x.jpg 1x, image-2x.jpg 2x')
    expect(img.dataset.srcset).toBeUndefined()
  })

  it('updates all source elements inside picture', () => {
    const picture = document.createElement('picture')
    const webpSource = document.createElement('source')
    webpSource.dataset.srcset = 'image.webp'
    const avifSource = document.createElement('source')
    avifSource.dataset.srcset = 'image.avif'
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'
    picture.append(avifSource, webpSource, img)

    loadImage(img)

    expect(webpSource.srcset).toBe('image.webp')
    expect(avifSource.srcset).toBe('image.avif')
    expect(img.src).toContain('image.jpg')
  })

  it('does not invoke onImageLoad for picture elements (no network load)', () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'
    picture.appendChild(img)
    const onLoad = vi.fn()

    loadImage(img, onLoad)

    expect(onLoad).not.toHaveBeenCalled()
  })

  it('does not invoke callbacks when no data attributes present', () => {
    const img = document.createElement('img')
    const onLoad = vi.fn()
    const onError = vi.fn()

    loadImage(img, onLoad, onError)

    expect(onLoad).not.toHaveBeenCalled()
    expect(onError).not.toHaveBeenCalled()
  })

  it('preloads standalone image without throwing', () => {
    const img = document.createElement('img')
    img.dataset.src = 'image.jpg'

    expect(() => loadImage(img)).not.toThrow()
  })
})
