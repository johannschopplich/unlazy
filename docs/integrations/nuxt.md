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

<<< @/../packages/nuxt/src/module.ts#ModuleOptions{ts}

Set the options under the `unlazy` key:

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
With `ssr: false`, the placeholder is decoded in the browser and only appears after hydration instead of on first paint.
:::

## `UnLazyImage` Component

The `UnLazyImage` component is [globally available](https://nuxt.com/docs/guide/concepts/auto-imports) in your Nuxt application.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | String | - | Image source URL to be lazy-loaded. |
| `srcSet` | String | - | Image source set to be lazy-loaded. |
| `sources` | Array | - | Array of [`UnLazySource`](/integrations/#unlazysource) objects to render a `<picture>` element. |
| `autoSizes` | Boolean | `false` | Whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | - | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | - | A ThumbHash string representing the blurry placeholder image. If both are provided, `thumbhash` takes precedence. |
| `placeholderSrc` | String | - | Optional image source URL for a custom placeholder image. Ignored if a hash is provided. |
| `placeholderSize` | Number | `32` | The size of the longer edge for BlurHash decoding. Ignored for ThumbHash. |
| `placeholderRatio` | Number | - | Aspect ratio (width / height) for BlurHash decoding. Without it, the server decodes a square placeholder. |
| `lazyLoad` | Boolean | `true` | Whether the image should be lazy-loaded. Set to `false` to defer loading until changed to `true`. |
| `preload` | Boolean | `false` | Whether the image should be preloaded immediately, bypassing lazy loading. |
| `ssr` | Boolean | Module option `ssr` | Whether hashes should be decoded on the server. Overrides the module option. |
| `loading` | String | `'lazy'` | Loading strategy for the image (`'lazy'` or `'eager'`). Defaults to `'eager'` while `lazyLoad` is `false`. |

The component also accepts all standard `<img>` HTML attributes via Nuxt's attribute inheritance.

### Emitted Events

| Event | Payload | Description |
| --- | --- | --- |
| `image-load` | `HTMLImageElement` | Fired once when the real image finishes loading. |
| `image-error` | `HTMLImageElement, Event` | Fired when the preload fails. |

::: info
Native `@error` listeners attach to the underlying `<img>` via Vue's attribute fallthrough and fire for both browser-level errors and the synthetic event unlazy dispatches when its preload fails. Reach for `@image-error` when you want the unwrapped element with a typed payload.
:::

## Examples

In every `srcSet` example, the `auto-sizes` prop calculates the `sizes` attribute automatically.

### Inlined Placeholder Image

```html [Inlined placeholder image]
<UnLazyImage
  placeholder-src="data:image/svg+xml, ..."
  src="/foo/bar.jpg"
/>
```

### BlurHash

```html
<UnLazyImage
  :blurhash="blurhash"
  :placeholder-ratio="2"
  src-set="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
  width="640"
  height="320"
/>
```

For a ThumbHash, pass `:thumbhash` instead of `:blurhash` and drop `:placeholder-ratio`. Add `:ssr="false"` to decode the hash in the browser.

::: info
When using client-side BlurHash decoding (`:ssr="false"`), set explicit `width` and `height` attributes. See [Hash-Based Placeholders](/guide/placeholders#using-data-attributes) for why.
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

Set `preload` to load the image before it enters the viewport, for example the next slide of a slider:

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
