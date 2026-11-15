import type { GlobalComponents } from 'vue'
import type { UnLazySource } from '../src'
import { expect, expectTypeOf, it, vi } from 'vitest'
import { render } from 'vitest-browser-vue'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { BLURHASH, createImageUrl, fetchImageRequests, recordDataSourceWrites } from '../../unlazy/test/fixtures'
import { UnLazyImage } from '../src/components'

it('loads the image and emits imageLoad once', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const screen = await render(UnLazyImage, {
    props: { src, onImageLoad },
  })

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  await new Promise(resolve => setTimeout(resolve, 100))
  expect(onImageLoad).toHaveBeenCalledOnce()
  expect(screen.container.querySelector('img')!.currentSrc).toBe(src)
})

it('loads the new image after a src change', async () => {
  const nextSrc = createImageUrl()
  const onImageLoad = vi.fn()
  const screen = await render(UnLazyImage, {
    props: {
      src: createImageUrl(),
      onImageLoad,
    },
  })
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)

  await screen.rerender({ src: nextSrc })

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(2)
  expect(screen.container.querySelector('img')!.currentSrc).toBe(nextSrc)
})

it('keeps the placeholder when a re-render passes an equal sources array', async () => {
  const src = createImageUrl({ delay: '300' })
  const onImageLoad = vi.fn()
  const createProps = () => ({
    src,
    sources: [
      { type: 'image/png', srcSet: src },
    ] satisfies UnLazySource[],
    blurhash: BLURHASH,
    onImageLoad,
  })
  const screen = await render(UnLazyImage, {
    props: createProps(),
  })
  const image = screen.container.querySelector('img')!
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)
  const placeholder = image.getAttribute('src')

  await screen.rerender(createProps())

  expect(image.getAttribute('src')).toBe(placeholder)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
})

it('emits no imageLoad after unmount', async () => {
  const src = createImageUrl({ delay: '100' })
  const onImageLoad = vi.fn()
  const screen = await render(UnLazyImage, {
    props: { src, onImageLoad },
  })
  await expect.poll(async () => (await fetchImageRequests(src)).length).toBe(1)

  await screen.unmount()
  await new Promise(resolve => setTimeout(resolve, 300))

  expect(onImageLoad).not.toHaveBeenCalled()
})

it('shows the blurhash placeholder during a preload', async () => {
  const screen = await render(UnLazyImage, {
    props: {
      src: createImageUrl({ delay: '200' }),
      blurhash: BLURHASH,
      preload: true,
    },
  })

  expect(screen.container.querySelector('img')!.getAttribute('src')).toMatch(/^data:image\/png/)
})

it('renders an eager image with src and srcset in the markup', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const container = document.body.appendChild(document.createElement('div'))
  const dataSourceWrites = recordDataSourceWrites(container)
  await render(UnLazyImage, {
    props: {
      src,
      srcSet: `${src} 1x`,
      loading: 'eager',
      onImageLoad,
    },
    container,
  })
  const image = container.querySelector('img')!

  expect(image.getAttribute('src')).toBe(src)
  expect(image.getAttribute('srcset')).toBe(`${src} 1x`)
  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(dataSourceWrites).toEqual([])
})

it('marks an eager image with data-error and emits imageError when it fails to load', async () => {
  const onImageError = vi.fn()
  const screen = await render(UnLazyImage, {
    props: {
      src: createImageUrl({ status: '404' }),
      loading: 'eager',
      onImageError,
    },
  })

  await expect.poll(() => onImageError.mock.calls.length).toBe(1)
  expect(screen.container.querySelector('img')!.hasAttribute('data-error')).toBe(true)
})

it('emits imageLoad for an eager image that loaded before hydration', async () => {
  const onImageLoad = vi.fn()
  const createApp = () => createSSRApp({
    render: () => h(UnLazyImage, {
      src: createImageUrl(),
      loading: 'eager',
      onImageLoad,
    }),
  })
  const container = document.body.appendChild(document.createElement('div'))
  container.innerHTML = await renderToString(createApp())
  const image = container.querySelector('img')!
  await new Promise(resolve => image.addEventListener('load', resolve, { once: true }))

  const app = createApp()
  app.mount(container)

  await expect.poll(() => onImageLoad).toHaveBeenCalledOnce()
  app.unmount()
})

it('defers loading behind the blurhash placeholder until lazyLoad is true', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const screen = await render(UnLazyImage, {
    props: {
      src,
      blurhash: BLURHASH,
      lazyLoad: false,
      onImageLoad,
    },
  })
  const image = screen.container.querySelector('img')!
  await new Promise(resolve => setTimeout(resolve, 100))

  expect(image.getAttribute('src')).toMatch(/^data:image\/png/)
  expect(await fetchImageRequests(src)).toEqual([])

  await screen.rerender({ lazyLoad: true })

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(image.currentSrc).toBe(src)
})

it('loads a preload image while lazyLoad is false', async () => {
  const src = createImageUrl()
  const onImageLoad = vi.fn()
  const screen = await render(UnLazyImage, {
    props: {
      src,
      lazyLoad: false,
      preload: true,
      onImageLoad,
    },
  })

  await expect.poll(() => onImageLoad.mock.calls.length).toBe(1)
  expect(screen.container.querySelector('img')!.currentSrc).toBe(src)
})

it('keeps the blurhash placeholder of a preload image while lazyLoad is false when it fails to load', async () => {
  const onImageError = vi.fn()
  const screen = await render(UnLazyImage, {
    props: {
      src: createImageUrl({ status: '404' }),
      blurhash: BLURHASH,
      lazyLoad: false,
      preload: true,
      onImageError,
    },
  })
  const image = screen.container.querySelector('img')!
  const placeholder = image.getAttribute('src')

  expect(placeholder).toMatch(/^data:image\/png/)
  await expect.poll(() => onImageError.mock.calls.length).toBe(1)
  expect(image.getAttribute('src')).toBe(placeholder)
  expect(image.hasAttribute('data-error')).toBe(true)
})

it('registers UnLazyImage as a global component', () => {
  expectTypeOf<GlobalComponents['UnLazyImage']>().toEqualTypeOf<typeof UnLazyImage>()
})
