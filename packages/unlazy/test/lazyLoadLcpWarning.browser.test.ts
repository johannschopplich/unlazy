import { describe, expect, it, onTestFinished, vi } from 'vitest'
import { lazyLoad } from '../src/lazyLoad'

describe('lazyLoad', () => {
  it('installs the LCP warning', () => {
    const observe = vi.spyOn(PerformanceObserver.prototype, 'observe')
    onTestFinished(() => observe.mockRestore())

    lazyLoad([])

    expect(observe).toHaveBeenCalledWith({ type: 'largest-contentful-paint', buffered: true })
  })
})
