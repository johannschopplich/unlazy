# `@unlazy/nuxt`

The Nuxt module provides an auto-imported `UnLazyImage` component as a drop-in replacement for native `<img>` and `<picture>` elements (when using the `sources` prop). It requires Nuxt 4.

## Installation

Install the `@unlazy/nuxt` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add @unlazy/nuxt
  ```
  ```bash [yarn]
  yarn add @unlazy/nuxt
  ```
  ```bash [npm]
  npm install @unlazy/nuxt
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

With `ssr: true`, `UnLazyImage` decodes the hash on the server and again during hydration to the same `src`, so the server-rendered placeholder stays until the real image has loaded.

::: warning
With `ssr: false`, the server-rendered HTML has no hash placeholder. The browser decodes the hash after hydration and takes a BlurHash's aspect ratio from the rendered image, so the placeholder appears only then instead of on first paint.
:::

## `UnLazyImage` Component

The `UnLazyImage` component is [globally available](https://nuxt.com/docs/guide/concepts/auto-imports) in your Nuxt application.

### Props

`UnLazyImage` takes the [props every integration shares](/integrations/#unlazyimage-props) and two of its own:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholderRatio` | Number | - | Aspect ratio (width / height) of a BlurHash decoded on the server. Defaults to the ratio of the `width` and `height` attributes when both are positive numbers, otherwise square. |
| `ssr` | Boolean | Module option `ssr` | Whether hashes should be decoded on the server. Overrides the module option. |

The component also accepts all standard `<img>` HTML attributes via Nuxt's attribute inheritance.

### Emitted Events

| Event | Payload | Description |
| --- | --- | --- |
| `image-load` | `HTMLImageElement` | Fired once when the real image finishes loading. |
| `image-error` | `HTMLImageElement, Event` | Fired when the image fails to load. |

A native `@error` listener falls through to the `<img>` and fires both for the browser's errors and for the synthetic `error` event unlazy dispatches when its preload fails. Use `@image-error` for the image element with a typed payload.

## Examples

```html
<UnLazyImage
  :blurhash="blurhash"
  src-set="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
  width="640"
  height="320"
/>
```

For a ThumbHash, pass `:thumbhash` instead of `:blurhash`, and add `:ssr="false"` to decode the hash in the browser. For an inlined placeholder image, pass `placeholder-src="data:image/svg+xml, ..."` instead.

::: info
When using BlurHash, set explicit `width` and `height` attributes. See [Hash-Based Placeholders](/guide/placeholders#using-data-attributes) for why.
:::

### Multiple Image Sources

Pass an array of [`UnLazySource`](/integrations/#unlazysource) objects as `sources` to render a `<picture>` element with format negotiation and art direction. Each entry becomes a `<source>` child:

```vue
<script setup lang="ts">
import type { UnLazySource } from '@unlazy/nuxt'

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
