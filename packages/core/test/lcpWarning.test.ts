import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type Listener = (entries: { getEntries: () => unknown[] }) => void

class FakePerformanceObserver {
  static instances: FakePerformanceObserver[] = []
  static observeCalls: unknown[] = []
  static shouldThrow = false

  callback: Listener

  constructor(cb: Listener) {
    this.callback = cb
    FakePerformanceObserver.instances.push(this)
  }

  observe(options: unknown): void {
    FakePerformanceObserver.observeCalls.push(options)
    if (FakePerformanceObserver.shouldThrow)
      throw new Error('NotSupportedError')
  }

  disconnect(): void {}

  fire(entries: unknown[]): void {
    this.callback({ getEntries: () => entries })
  }
}

function makeEntry(element: Element | null): unknown {
  return { element }
}

let originalPO: typeof PerformanceObserver | undefined
let consoleWarn: ReturnType<typeof vi.spyOn>

beforeEach(() => {
  vi.resetModules()
  FakePerformanceObserver.instances = []
  FakePerformanceObserver.observeCalls = []
  FakePerformanceObserver.shouldThrow = false

  originalPO = globalThis.PerformanceObserver
  globalThis.PerformanceObserver = FakePerformanceObserver as unknown as typeof PerformanceObserver
  consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
})

afterEach(() => {
  if (originalPO)
    globalThis.PerformanceObserver = originalPO
  consoleWarn.mockRestore()
})

describe('installLcpWarning', () => {
  it('constructs a single observer across multiple install calls', async () => {
    const { installLcpWarning } = await import('../src/lcpWarning')

    installLcpWarning()
    installLcpWarning()
    installLcpWarning()

    expect(FakePerformanceObserver.instances).toHaveLength(1)
    expect(FakePerformanceObserver.observeCalls).toHaveLength(1)
  })

  it('warns when the LCP element is an img with loading="lazy"', async () => {
    const { installLcpWarning } = await import('../src/lcpWarning')
    installLcpWarning()

    const img = document.createElement('img')
    img.loading = 'lazy'

    FakePerformanceObserver.instances[0]!.fire([makeEntry(img)])

    expect(consoleWarn).toHaveBeenCalledWith(
      expect.stringContaining('LCP element is configured for lazy loading'),
      img,
    )
  })

  it('warns when the LCP element is an img still holding data-src', async () => {
    const { installLcpWarning } = await import('../src/lcpWarning')
    installLcpWarning()

    const img = document.createElement('img')
    img.loading = 'eager'
    img.setAttribute('data-src', 'hero.jpg')

    FakePerformanceObserver.instances[0]!.fire([makeEntry(img)])

    expect(consoleWarn).toHaveBeenCalled()
  })

  it('does not warn when the LCP element is not an img', async () => {
    const { installLcpWarning } = await import('../src/lcpWarning')
    installLcpWarning()

    const div = document.createElement('div')

    FakePerformanceObserver.instances[0]!.fire([makeEntry(div)])

    expect(consoleWarn).not.toHaveBeenCalled()
  })

  it('silently no-ops when PerformanceObserver.observe throws', async () => {
    FakePerformanceObserver.shouldThrow = true
    const { installLcpWarning } = await import('../src/lcpWarning')

    expect(() => installLcpWarning()).not.toThrow()
    expect(consoleWarn).not.toHaveBeenCalled()
  })
})
