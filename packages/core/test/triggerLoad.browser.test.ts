import { describe, expect, it, vi } from 'vitest'
import { lazyLoad, triggerLoad } from '../src/lazyLoad'

// Tiny 1x1 transparent PNG; decodes synchronously in every browser
const TINY_PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

describe('triggerLoad (browser)', () => {
  it('invokes onImageLoad after the preload image resolves', async () => {
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('onImageLoad not called')), 2000)
      triggerLoad(img, () => {
        clearTimeout(timer)
        resolve()
      })
    })

    expect(img.src).toBe(TINY_PNG)
    expect(img.dataset.src).toBeUndefined()
  })

  it('invokes onImageError when the preload image fails', async () => {
    const img = document.createElement('img')
    img.dataset.src = 'data:image/png;base64,not-a-valid-png'

    const onError = vi.fn()

    await new Promise<void>((resolve) => {
      const timer = setTimeout(resolve, 500)
      triggerLoad(img, undefined, (_image, event) => {
        onError(_image, event)
        clearTimeout(timer)
        resolve()
      })
    })

    expect(onError).toHaveBeenCalled()
  })

  it('cleanup prevents the onImageLoad callback from firing', async () => {
    const img = document.createElement('img')
    img.loading = 'lazy'
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)
    const onLoad = vi.fn()

    const cleanup = lazyLoad(img, { onImageLoad: onLoad })
    cleanup()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onLoad).not.toHaveBeenCalled()
  })
})
