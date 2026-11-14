import type { ComponentProps } from 'svelte'
import type { UnLazySource } from '../src/lib'
import { flushSync } from 'svelte'
import { expect, it, vi } from 'vitest'
import { render } from 'vitest-browser-svelte'
import { BLURHASH, createImageUrl, fetchImageRequests, recordDataSourceWrites } from '../../unlazy/test/fixtures'
import { UnLazyImage } from '../src/lib'

it('loads the image and calls onImageLoad once', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const screen = await render(UnLazyImage, { src, onImageLoad })

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  await new Promise(resolve => setTimeout(resolve, 100))
  expect(onImageLoad).toHaveBeenCalledOnce()
  expect(screen.container.querySelector('img')!.currentSrc).toBe(src)
})

it('loads the new image after a src change', async () => {
  const nextSrc = createImageUrl()
  const onImageLoad = vi.fn()
  // A `$state` object updates each prop on its own, as a parent component does.
  const props = $state<ComponentProps<typeof UnLazyImage>>({
    src: createImageUrl(),
    onImageLoad,
  })
  const screen = await render(UnLazyImage, props)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)

  props.src = nextSrc
  flushSync()

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(2)
  expect(screen.container.querySelector('img')!.currentSrc).toBe(nextSrc)
})

it('keeps the placeholder when a parent passes a new onImageLoad and sources', async () => {
  const src = createImageUrl({ delay: '300' })
  const onImageLoad = vi.fn()
  const createSources = (): UnLazySource[] => [
    { type: 'image/png', srcSet: src },
  ]
  const props = $state<ComponentProps<typeof UnLazyImage>>({
    src,
    sources: createSources(),
    blurhash: BLURHASH,
    onImageLoad: image => onImageLoad(image),
  })
  const screen = await render(UnLazyImage, props)
  const image = screen.container.querySelector('img')!
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)
  const placeholder = image.getAttribute('src')

  props.sources = createSources()
  props.onImageLoad = image => onImageLoad(image)
  flushSync()

  expect(image.getAttribute('src')).toBe(placeholder)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
})

it('keeps the loaded image when a parent changes alt', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const props = $state<ComponentProps<typeof UnLazyImage>>({
    src,
    alt: 'Before',
    onImageLoad,
  })
  const screen = await render(UnLazyImage, props)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)

  props.alt = 'After'
  flushSync()

  expect(screen.container.querySelector('img')!.getAttribute('src')).toBe(src)
})

it('calls no onImageLoad after unmount', async () => {
  const src = createImageUrl({ delay: '100' })
  const onImageLoad = vi.fn()
  const screen = await render(UnLazyImage, { src, onImageLoad })
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)

  await screen.unmount()
  await new Promise(resolve => setTimeout(resolve, 300))

  expect(onImageLoad).not.toHaveBeenCalled()
})

it('shows the blurhash placeholder during a preload', async () => {
  const screen = await render(UnLazyImage, {
    src: createImageUrl({ delay: '200' }),
    blurhash: BLURHASH,
    preload: true,
  })

  expect(screen.container.querySelector('img')!.getAttribute('src')).toMatch(/^data:image\/png/)
})

it('renders an eager image with src and srcset in the markup', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const container = document.body.appendChild(document.createElement('div'))
  const dataSourceWrites = recordDataSourceWrites(container)
  await render(UnLazyImage, {
    target: container,
    props: {
      src,
      srcSet: `${src} 1x`,
      loading: 'eager',
      onImageLoad,
    },
  })
  const image = container.querySelector('img')!

  expect(image.getAttribute('src')).toBe(src)
  expect(image.getAttribute('srcset')).toBe(`${src} 1x`)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(dataSourceWrites).toEqual([])
})

it('calls onImageLoad of an eager image beside an onload attribute', async () => {
  const onload = vi.fn()
  const onImageLoad = vi.fn()
  await render(UnLazyImage, {
    src: createImageUrl(),
    loading: 'eager',
    onload,
    onImageLoad,
  })

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(onload).toHaveBeenCalledOnce()
})

it('marks an eager image with data-error and calls onImageError when it fails to load', async () => {
  const onerror = vi.fn()
  const onImageError = vi.fn()
  const screen = await render(UnLazyImage, {
    src: createImageUrl({ status: '404' }),
    loading: 'eager',
    onerror,
    onImageError,
  })

  await expect.poll(() => onImageError.mock.calls.length).toBe(1)
  expect(screen.container.querySelector('img')!.hasAttribute('data-error')).toBe(true)
  expect(onerror).toHaveBeenCalledOnce()
})
