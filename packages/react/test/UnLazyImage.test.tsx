import type { UnLazySource } from '../src'
import { createRef } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-react'
import { BLURHASH, createImageUrl, fetchImageRequests, recordDataSourceWrites } from '../../unlazy/test/fixtures'
import { UnLazyImage } from '../src'

it('loads the image and calls onImageLoad once', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const screen = await render(<UnLazyImage src={src} onImageLoad={onImageLoad} />)
  const image = screen.container.querySelector('img')!

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  await new Promise(resolve => setTimeout(resolve, 100))
  expect(onImageLoad).toHaveBeenCalledOnce()
  expect(image.currentSrc).toBe(src)
})

it('loads the new image after a src change', async () => {
  const firstSrc = createImageUrl()
  const nextSrc = createImageUrl()
  const onImageLoad = vi.fn()
  const screen = await render(<UnLazyImage src={firstSrc} onImageLoad={onImageLoad} />)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)

  await screen.rerender(<UnLazyImage src={nextSrc} onImageLoad={onImageLoad} />)

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(2)
  expect(screen.container.querySelector('img')!.currentSrc).toBe(nextSrc)
})

it('loads the new image after a sources change', async () => {
  const src = createImageUrl()
  const nextSourceSrc = createImageUrl()
  const onImageLoad = vi.fn()
  const renderImage = (sourceSrc: string) => (
    <UnLazyImage
      src={src}
      sources={[
        { srcSet: sourceSrc },
      ]}
      blurhash={BLURHASH}
      onImageLoad={onImageLoad}
    />
  )
  const screen = await render(renderImage(createImageUrl()))
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)

  await screen.rerender(renderImage(nextSourceSrc))

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(2)
  expect(screen.container.querySelector('img')!.currentSrc).toBe(nextSourceSrc)
})

it('keeps the placeholder when a re-render passes a new onImageLoad and sources', async () => {
  const src = createImageUrl({ delay: '300' })
  const onImageLoad = vi.fn()
  const renderImage = () => (
    <UnLazyImage
      src={src}
      sources={[
        { type: 'image/png', srcSet: src },
      ] satisfies UnLazySource[]}
      blurhash={BLURHASH}
      onImageLoad={image => onImageLoad(image)}
    />
  )
  const screen = await render(renderImage())
  const image = screen.container.querySelector('img')!
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)
  const placeholder = image.getAttribute('src')

  await screen.rerender(renderImage())

  expect(image.getAttribute('src')).toBe(placeholder)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
})

it('calls no onImageLoad after unmount', async () => {
  const src = createImageUrl({ delay: '100' })
  const onImageLoad = vi.fn()
  const screen = await render(<UnLazyImage src={src} onImageLoad={onImageLoad} />)
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)

  await screen.unmount()
  await new Promise(resolve => setTimeout(resolve, 300))

  expect(onImageLoad).not.toHaveBeenCalled()
})

it('shows the blurhash placeholder during a preload', async () => {
  const screen = await render(<UnLazyImage src={createImageUrl({ delay: '200' })} blurhash={BLURHASH} preload />)

  expect(screen.container.querySelector('img')!.getAttribute('src')).toMatch(/^data:image\/png/)
})

it('renders an eager image with src and srcset in the markup', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const container = document.body.appendChild(document.createElement('div'))
  const dataSourceWrites = recordDataSourceWrites(container)
  await render(
    <UnLazyImage src={src} srcSet={`${src} 1x`} loading="eager" onImageLoad={onImageLoad} />,
    { container },
  )
  const image = container.querySelector('img')!

  expect(image.getAttribute('src')).toBe(src)
  expect(image.getAttribute('srcset')).toBe(`${src} 1x`)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(dataSourceWrites).toEqual([])
})

it('marks an eager image with data-error and calls onImageError when it fails to load', async () => {
  const onImageError = vi.fn()
  const screen = await render(<UnLazyImage src={createImageUrl({ status: '404' })} loading="eager" onImageError={onImageError} />)

  await expect.poll(() => onImageError.mock.calls.length).toBe(1)
  expect(screen.container.querySelector('img')!.hasAttribute('data-error')).toBe(true)
})

it('calls onImageLoad of an eager image that loaded before hydration', async () => {
  const onImageLoad = vi.fn()
  const element = <UnLazyImage src={createImageUrl()} loading="eager" onImageLoad={onImageLoad} />
  const container = document.body.appendChild(document.createElement('div'))
  container.innerHTML = renderToString(element)
  const image = container.querySelector('img')!
  await new Promise(resolve => image.addEventListener('load', resolve, { once: true }))

  const root = hydrateRoot(container, element)

  await expect.poll(() => onImageLoad).toHaveBeenCalledOnce()
  root.unmount()
})

it('forwards a ref to the image and still loads it', async () => {
  const ref = createRef<HTMLImageElement>()
  const onImageLoad = vi.fn()
  await render(<UnLazyImage ref={ref} src={createImageUrl()} onImageLoad={onImageLoad} />)

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(ref.current).toBeInstanceOf(HTMLImageElement)
})
