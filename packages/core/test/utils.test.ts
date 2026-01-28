import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createIndexedImagePlaceholder, debounce, toElementArray } from '../src/utils'

describe('toElementArray', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('converts CSS selector to element array', () => {
    document.body.innerHTML = '<img class="lazy" /><img class="lazy" /><img class="other" />'

    const result = toElementArray<HTMLImageElement>('.lazy')

    expect(result).toHaveLength(2)
    expect(result[0]).toBeInstanceOf(HTMLImageElement)
    expect(result[1]).toBeInstanceOf(HTMLImageElement)
  })

  it('wraps single element in array', () => {
    const img = document.createElement('img')

    const result = toElementArray(img)

    expect(result).toEqual([img])
  })

  it('converts NodeList to array', () => {
    document.body.innerHTML = '<img /><img /><img />'
    const nodeList = document.querySelectorAll('img')

    const result = toElementArray(nodeList)

    expect(result).toHaveLength(3)
    expect(Array.isArray(result)).toBe(true)
  })

  it('returns array as-is', () => {
    const images = [document.createElement('img'), document.createElement('img')]

    const result = toElementArray(images)

    expect(result).toEqual(images)
  })

  it('scopes selector to parent element when provided', () => {
    document.body.innerHTML = '<div id="container"><img class="lazy" /></div><img class="lazy" />'
    const container = document.getElementById('container')!

    const result = toElementArray<HTMLImageElement>('.lazy', container)

    expect(result).toHaveLength(1)
  })

  it('returns empty array for non-matching selector', () => {
    const result = toElementArray('.does-not-exist')

    expect(result).toEqual([])
  })
})

describe('createIndexedImagePlaceholder', () => {
  it('returns valid SVG data URI', () => {
    const placeholder = createIndexedImagePlaceholder(0)

    expect(placeholder).toMatch(/^data:image\/svg\+xml/)
  })

  it('includes unique data-id attribute with index', () => {
    const placeholder = createIndexedImagePlaceholder(5)

    expect(placeholder).toMatch(/data-id='\d+-5'/)
  })

  it('generates different IDs for different indices', () => {
    const placeholder1 = createIndexedImagePlaceholder(0)
    const placeholder2 = createIndexedImagePlaceholder(1)

    expect(placeholder1).not.toBe(placeholder2)
  })
})

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delays function execution by specified time', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledOnce()
  })

  it('resets timer on subsequent calls', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(50)
    debounced()
    vi.advanceTimersByTime(99)
    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(fn).toHaveBeenCalledOnce()
  })

  it('passes arguments to debounced function', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('arg1', 'arg2')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('uses latest arguments when called multiple times', () => {
    const fn = vi.fn()
    const debounced = debounce(fn, 100)

    debounced('first')
    debounced('second')
    debounced('third')
    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledOnce()
    expect(fn).toHaveBeenCalledWith('third')
  })
})
