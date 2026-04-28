# `@unlazy/nuxt`

The Nuxt module provides an auto-imported `UnLazyImage` component as a drop-in replacement for native `<img>` and `<picture>` elements (when using the `sources` prop).

## Installation

Install the `@unlazy/nuxt` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add -D @unlazy/nuxt
  ```
  ```bash [yarn]
  yarn add -D @unlazy/nuxt
  ```
  ```bash [npm]
  npm install -D @unlazy/nuxt
  ```
:::

Add the `@unlazy/nuxt` module to your Nuxt configuration:

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['@unlazy/nuxt']
})
```

## Module Options

The `@unlazy/nuxt` module accepts the following options:

<<< @/../packages/nuxt/src/module.ts#ModuleOptions{ts}

Adapt the module options to your needs:

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['@unlazy/nuxt'],

  // Module options
  unlazy: {
    ssr: false
  }
})
```

::: warning
Disabling server-side rendering of the blurry placeholder image will result in a flash of the original image on the initial page load and largely defeats the purpose of the SSR abilities from Nuxt.
:::

## `UnLazyImage` Component

The `UnLazyImage` component is [globally available](https://nuxt.com/docs/guide/concepts/auto-imports) in your Nuxt application.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | String | - | Image source URL to be lazy-loaded. |
| `srcSet` | String | - | Image source set to be lazy-loaded. |
| `sources` | Array | - | Array of `UnLazySource` objects to render a `<picture>` element. |
| `autoSizes` | Boolean | `false` | Whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | - | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | - | A ThumbHash string representing the blurry placeholder image. If both are provided, `thumbhash` takes precedence. |
| `placeholderSrc` | String | - | Optional image source URL for a custom placeholder image. Ignored if a hash is provided. |
| `placeholderSize` | Number | `32` | The size of the longer edge for BlurHash decoding. Ignored for ThumbHash. |
| `placeholderRatio` | Number | - | Aspect ratio (width / height) for BlurHash decoding during SSR. |
| `lazyLoad` | Boolean | `true` | Whether the image should be lazy-loaded. Set to `false` to defer loading until changed to `true`. |
| `preload` | Boolean | `false` | Whether the image should be preloaded immediately, bypassing lazy loading. |
| `ssr` | Boolean | `true` | Whether hashes should be decoded on the server. Overrides global module config. |
| `loading` | String | `'lazy'` | Loading strategy for the image (`'lazy'` or `'eager'`). |

The component also accepts all standard `<img>` HTML attributes via Nuxt's attribute inheritance.

### Emitted Events

| Event | Payload | Description |
| --- | --- | --- |
| `image-load` | `HTMLImageElement` | Fired once when the real image finishes loading. |
| `image-error` | `HTMLImageElement, Event` | Fired when the preload fails. |

::: info
Native `@error` listeners attach to the underlying `<img>` via Vue's attribute fallthrough and fire for both browser-level errors and the synthetic event unlazy dispatches when its preload fails. Reach for `@image-error` when you want the unwrapped element with a typed payload.
:::

### Server-Side Rendering

The Nuxt module decodes BlurHash and ThumbHash strings on the server during SSR, providing placeholder images before the HTML is sent to the client. This prevents layout shifts and improves perceived performance.

The `ssr` option (enabled by default) can be overridden per-component or disabled globally in `nuxt.config.ts`.

## Examples

::: tip
In every `srcSet` example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::

### Inlined Placeholder Image

```html [Inlined placeholder image]
<UnLazyImage
  placeholder-src="data:image/svg+xml, ..."
  src="/foo/bar.jpg"
/>
```

### BlurHash

::: code-group
  ```html [SSR-decoded BlurHash]
  <UnLazyImage
    :blurhash="blurhash"
    :placeholder-ratio="2"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    width="640"
    height="320"
  />
  ```
  ```html [Client-side decoded BlurHash]
  <UnLazyImage
    :ssr="false"
    :blurhash="blurhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    width="640"
    height="320"
  />
  ```
:::

### ThumbHash

::: code-group
  ```html [SSR-decoded ThumbHash]
  <UnLazyImage
    :thumbhash="thumbhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    width="640"
    height="320"
  />
  ```
  ```html [Client-side decoded ThumbHash]
  <UnLazyImage
    :ssr="false"
    :thumbhash="thumbhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    width="640"
    height="320"
  />
  ```
:::

### Multiple Image Sources

Pass `sources` to render a `<picture>` element with format negotiation and art direction. Each entry becomes a `<source>` child:

```vue
<script setup lang="ts">
import type { UnLazySource } from 'unlazy'

const sources: UnLazySource[] = [
  { type: 'image/avif', srcSet: 'hero.avif 1x, hero@2x.avif 2x' },
  {
    media: '(max-width: 600px)',
    srcSet: 'hero-mobile.jpg',
    width: 480,
    height: 640,
  },
]
</script>

<template>
  <UnLazyImage
    src="/hero.jpg"
    :sources="sources"
    width="640"
    height="427"
  />
</template>
```

::: tip
Set `width` and `height` per source to prevent layout shift when the breakpoint changes. Modern browsers use the matched `<source>`'s dimensions for the rendered `<img>`'s aspect ratio.
:::

### Preload Image

Useful if the `UnLazyImage` is part of e.g. a slider, and you want to preload the next image.

```vue
<template>
  <UnLazyImage
    width="640"
    height="320"
    :blurhash="blurhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    preload
  />
</template>
```

::: info
When using client-side BlurHash decoding (`:ssr="false"`), set explicit `width` and `height` attributes for optimal performance. Server-side rendering (enabled by default) is less affected by this, but including these attributes is still recommended as a best practice.
:::
