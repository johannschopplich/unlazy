import type { JSX } from 'solid-js'
import type { UnLazySource } from '../src'
import { createSignal } from 'solid-js'
import { render } from 'solid-js/web'
import { afterEach, expect, it, vi } from 'vitest'
import { BLURHASH, createImageUrl, fetchImageRequests, recordDataSourceWrites } from '../../unlazy/test/fixtures'
import { UnLazyImage } from '../src'

const disposers: (() => void)[] = []

afterEach(() => {
  for (const dispose of disposers.splice(0))
    dispose()
})

it('loads the image and calls onImageLoad once', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const container = mount(() => <UnLazyImage src={src} onImageLoad={onImageLoad} />)

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  await new Promise(resolve => setTimeout(resolve, 100))
  expect(onImageLoad).toHaveBeenCalledOnce()
  expect(container.querySelector('img')!.currentSrc).toBe(src)
})

it('defers loading behind the blurhash placeholder until lazyLoad is true', async () => {
  const src = createImageUrl()
  const [lazyLoad, setLazyLoad] = createSignal(false)
  const onImageLoad = vi.fn()
  const container = mount(() => <UnLazyImage src={src} blurhash={BLURHASH} lazyLoad={lazyLoad()} onImageLoad={onImageLoad} />)
  const image = container.querySelector('img')!
  await new Promise(resolve => setTimeout(resolve, 100))

  expect(image.getAttribute('src')).toMatch(/^data:image\/png/)
  expect(await fetchImageRequests(src)).toEqual([])

  setLazyLoad(true)

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(image.currentSrc).toBe(src)
})

it('loads the new image after a src change', async () => {
  const nextSrc = createImageUrl()
  const [src, setSrc] = createSignal(createImageUrl())
  const onImageLoad = vi.fn()
  const container = mount(() => <UnLazyImage src={src()} onImageLoad={onImageLoad} />)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)

  setSrc(nextSrc)

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(2)
  expect(container.querySelector('img')!.currentSrc).toBe(nextSrc)
})

it('keeps the placeholder when a re-render passes a new onImageLoad and sources', async () => {
  const src = createImageUrl({ delay: '300' })
  const onImageLoad = vi.fn()
  const [renderCount, setRenderCount] = createSignal(0)
  const container = mount(() => (
    <UnLazyImage
      src={src}
      sources={(renderCount(), [
        { type: 'image/png', srcSet: src },
      ] satisfies UnLazySource[])}
      blurhash={BLURHASH}
      onImageLoad={(renderCount(), image => onImageLoad(image))}
    />
  ))
  const image = container.querySelector('img')!
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)
  const placeholder = image.getAttribute('src')

  setRenderCount(1)

  expect(image.getAttribute('src')).toBe(placeholder)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
})

it('calls no onImageLoad after unmount', async () => {
  const src = createImageUrl({ delay: '100' })
  const onImageLoad = vi.fn()
  mount(() => <UnLazyImage src={src} onImageLoad={onImageLoad} />)
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)

  disposers.pop()!()
  await new Promise(resolve => setTimeout(resolve, 300))

  expect(onImageLoad).not.toHaveBeenCalled()
})

it('shows the blurhash placeholder during a preload', () => {
  const container = mount(() => <UnLazyImage src={createImageUrl({ delay: '200' })} blurhash={BLURHASH} preload />)

  expect(container.querySelector('img')!.getAttribute('src')).toMatch(/^data:image\/png/)
})

it('renders an eager image with src and srcset in the markup', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const container = document.body.appendChild(document.createElement('div'))
  const dataSourceWrites = recordDataSourceWrites(container)
  mount(() => <UnLazyImage src={src} srcSet={`${src} 1x`} loading="eager" onImageLoad={onImageLoad} />, container)
  const image = container.querySelector('img')!

  expect(image.getAttribute('src')).toBe(src)
  expect(image.getAttribute('srcset')).toBe(`${src} 1x`)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(dataSourceWrites).toEqual([])
})

it('marks an eager image with data-error and calls onImageError when it fails to load', async () => {
  const onImageError = vi.fn()
  const container = mount(() => <UnLazyImage src={createImageUrl({ status: '404' })} loading="eager" onImageError={onImageError} />)

  await expect.poll(() => onImageError.mock.calls.length).toBe(1)
  expect(container.querySelector('img')!.hasAttribute('data-error')).toBe(true)
})

function mount(
  code: () => JSX.Element,
  container = document.body.appendChild(document.createElement('div')),
): HTMLElement {
  disposers.push(render(code, container))
  return container
}
