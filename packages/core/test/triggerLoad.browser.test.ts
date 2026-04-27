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
      triggerLoad(img, {
        onImageLoad: () => {
          clearTimeout(timer)
          resolve()
        },
      })
    })

    expect(img.src).toBe(TINY_PNG)
    expect(img.dataset.src).toBeUndefined()
  })

  it('invokes onImageError and dispatches a native error on failure', async () => {
    const img = document.createElement('img')
    img.dataset.src = 'data:image/png;base64,not-a-valid-png'

    const onError = vi.fn()
    const nativeError = vi.fn()

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('error not delivered')), 2000)
      img.addEventListener('error', () => {
        nativeError()
        clearTimeout(timer)
        resolve()
      }, { once: true })
      triggerLoad(img, {
        onImageError: (_image, event) => {
          onError(_image, event)
        },
      })
    })

    expect(onError).toHaveBeenCalled()
    expect(nativeError).toHaveBeenCalled()
    // Visible image keeps its placeholder state on failure
    expect(img.dataset.src).toBe('data:image/png;base64,not-a-valid-png')
  })

  it('cleanup detaches lazy-path callbacks before they fire', async () => {
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

  it('cleanup cancels an in-flight lazy-path preload', async () => {
    const img = document.createElement('img')
    img.loading = 'lazy'
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)
    const onLoad = vi.fn()

    const cleanup = lazyLoad(img, { onImageLoad: onLoad })

    // unlazy registers its load listener first, so it runs before this one and
    // starts triggerLoad's preload during the same dispatch.
    await new Promise<void>(resolve => img.addEventListener('load', () => resolve(), { once: true }))

    cleanup()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onLoad).not.toHaveBeenCalled()
  })

  it('invokes onImageLoad once for picture-wrapped images', async () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    // Real apps via lazyLoad set image.src = placeholder before triggerLoad runs
    img.src = TINY_PNG
    picture.appendChild(img)
    document.body.appendChild(picture)

    const calls: string[] = []

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('onImageLoad not called for picture')), 2000)
      triggerLoad(img, {
        onImageLoad: (image) => {
          calls.push(image.src)
          clearTimeout(timer)
          resolve()
        },
      })
    })

    expect(calls).toHaveLength(1)
    expect(img.dataset.src).toBeUndefined()
    expect(img.src).toBe(TINY_PNG)
  })

  it('invokes onImageError and fires native error for picture-wrapped images on failure', async () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = 'data:image/png;base64,not-a-valid-png'
    picture.appendChild(img)
    document.body.appendChild(picture)

    const onError = vi.fn()
    const nativeError = vi.fn()

    let firedCount = 0
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('error not delivered for picture')), 2000)
      const tick = () => {
        if (++firedCount === 2) {
          clearTimeout(timer)
          resolve()
        }
      }
      img.addEventListener('error', () => {
        nativeError()
        tick()
      }, { once: true })
      triggerLoad(img, {
        onImageError: (image, event) => {
          onError(image, event)
          tick()
        },
      })
    })

    expect(onError).toHaveBeenCalled()
    expect(nativeError).toHaveBeenCalled()
  })

  it('disposer cancels an in-flight standalone preload', async () => {
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    const onImageLoad = vi.fn()
    const dispose = triggerLoad(img, { onImageLoad })
    dispose()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onImageLoad).not.toHaveBeenCalled()
  })

  it('disposer cancels an in-flight picture-wrapped load', async () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    picture.appendChild(img)
    document.body.appendChild(picture)

    const onImageLoad = vi.fn()
    const dispose = triggerLoad(img, { onImageLoad })
    dispose()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onImageLoad).not.toHaveBeenCalled()
  })

  it('tolerates calling the disposer twice', () => {
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    const dispose = triggerLoad(img, { onImageLoad: vi.fn() })
    dispose()
    expect(() => dispose()).not.toThrow()
  })

  it('disposer is a no-op when called after the load completes', async () => {
    const img = document.createElement('img')
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    const onImageLoad = vi.fn()
    let dispose!: () => void

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('load did not complete')), 2000)
      dispose = triggerLoad(img, {
        onImageLoad: (image) => {
          onImageLoad(image)
          clearTimeout(timer)
          resolve()
        },
      })
    })

    expect(() => dispose()).not.toThrow()
    expect(onImageLoad).toHaveBeenCalledTimes(1)
  })

  it('dispatches native error before invoking onImageError', async () => {
    const img = document.createElement('img')
    img.dataset.src = 'data:image/png;base64,not-a-valid-png'
    document.body.appendChild(img)

    const order: string[] = []

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('events not delivered')), 2000)
      img.addEventListener('error', () => {
        order.push('native')
      }, { once: true })
      triggerLoad(img, {
        onImageError: () => {
          order.push('callback')
          clearTimeout(timer)
          resolve()
        },
      })
    })

    expect(order).toEqual(['native', 'callback'])
  })
})

describe('lazyLoad eager-priority path (browser)', () => {
  it('invokes onImageLoad for eager images', async () => {
    const img = document.createElement('img')
    img.loading = 'eager'
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('onImageLoad not called for eager image')), 2000)
      lazyLoad(img, {
        onImageLoad: () => {
          clearTimeout(timer)
          resolve()
        },
      })
    })

    expect(img.src).toBe(TINY_PNG)
    expect(img.dataset.src).toBeUndefined()
  })

  it('invokes onImageError and fires native error for eager images on failure', async () => {
    const img = document.createElement('img')
    img.loading = 'eager'
    img.dataset.src = 'data:image/png;base64,not-a-valid-png'
    document.body.appendChild(img)

    const onError = vi.fn()
    const nativeError = vi.fn()

    let firedCount = 0
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('error not delivered for eager image')), 2000)
      const tick = () => {
        if (++firedCount === 2) {
          clearTimeout(timer)
          resolve()
        }
      }
      img.addEventListener('error', () => {
        nativeError()
        tick()
      }, { once: true })
      lazyLoad(img, {
        onImageError: (image, event) => {
          onError(image, event)
          tick()
        },
      })
    })

    expect(onError).toHaveBeenCalled()
    expect(nativeError).toHaveBeenCalled()
  })

  it('cleanup detaches eager-priority callbacks before they fire', async () => {
    const img = document.createElement('img')
    img.loading = 'eager'
    img.dataset.src = TINY_PNG
    document.body.appendChild(img)

    const onLoad = vi.fn()
    const cleanup = lazyLoad(img, { onImageLoad: onLoad })
    cleanup()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onLoad).not.toHaveBeenCalled()
  })

  it('invokes onImageLoad for eager picture-wrapped images', async () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.loading = 'eager'
    img.dataset.src = TINY_PNG
    picture.appendChild(img)
    document.body.appendChild(picture)

    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('onImageLoad not called for eager picture')), 2000)
      lazyLoad(img, {
        onImageLoad: () => {
          clearTimeout(timer)
          resolve()
        },
      })
    })

    expect(img.src).toBe(TINY_PNG)
    expect(img.dataset.src).toBeUndefined()
  })

  it('invokes onImageError and fires native error for eager picture-wrapped images on failure', async () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.loading = 'eager'
    img.dataset.src = 'data:image/png;base64,not-a-valid-png'
    picture.appendChild(img)
    document.body.appendChild(picture)

    const onError = vi.fn()
    const nativeError = vi.fn()

    let firedCount = 0
    await new Promise<void>((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('error not delivered for eager picture')), 2000)
      const tick = () => {
        if (++firedCount === 2) {
          clearTimeout(timer)
          resolve()
        }
      }
      img.addEventListener('error', () => {
        nativeError()
        tick()
      }, { once: true })
      lazyLoad(img, {
        onImageError: (image, event) => {
          onError(image, event)
          tick()
        },
      })
    })

    expect(onError).toHaveBeenCalled()
    expect(nativeError).toHaveBeenCalled()
  })

  it('cleanup suppresses eager-priority callbacks for picture-wrapped images', async () => {
    const picture = document.createElement('picture')
    const img = document.createElement('img')
    img.loading = 'eager'
    img.dataset.src = TINY_PNG
    picture.appendChild(img)
    document.body.appendChild(picture)

    const onLoad = vi.fn()
    const cleanup = lazyLoad(img, { onImageLoad: onLoad })
    cleanup()

    await new Promise(resolve => setTimeout(resolve, 200))

    expect(onLoad).not.toHaveBeenCalled()
  })
})
