# `@unlazy/vue`

The Vue integration provides an `UnLazyImage` component for your Vue application.

## Installation

Install the `@unlazy/vue` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add -D @unlazy/vue
  ```
  ```bash [yarn]
  yarn add -D @unlazy/vue
  ```
  ```bash [npm]
  npm install -D @unlazy/vue
  ```
:::

### Local Import

Import the `UnLazyImage` component in your Vue single file component and use it in your template:

```vue
<script setup lang="ts">
import { UnLazyImage } from '@unlazy/vue/components'
</script>

<template>
  <UnLazyImage
    blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
  />
</template>
```

### Global Registration

To make the `UnLazyImage` component available in every template, register the plugin in your `main.ts` file:

```ts
// src/main.ts
import Unlazy from '@unlazy/vue'
import { createApp } from 'vue'
import App from './App.vue'

const app = createApp(App)
app.use(Unlazy)
app.mount('#app')
```

## `UnLazyImage` Component

`UnLazyImage` renders a lazy-loaded `<img>`, or a `<picture>` when you pass `sources`.

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
| `preload` | Boolean | `false` | Whether the image should be preloaded immediately, bypassing lazy loading. |
| `loading` | String | `'lazy'` | Loading strategy for the image (`'lazy'` or `'eager'`). |

The component also accepts all standard `<img>` HTML attributes via Vue's attribute inheritance.

### Emitted Events

| Event | Payload | Description |
| --- | --- | --- |
| `image-load` | `HTMLImageElement` | Fired once when the real image finishes loading. |
| `image-error` | `HTMLImageElement, Event` | Fired when the preload fails. |

::: info
Native `@error` listeners attach to the underlying `<img>` via Vue's attribute fallthrough and fire for both browser-level errors and the synthetic event unlazy dispatches when its preload fails. Reach for `@image-error` when you want the unwrapped element with a typed payload.
:::

## Examples

```html
<UnLazyImage
  width="800"
  height="600"
  blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
  src-set="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>
```

For a ThumbHash, pass `thumbhash` instead of `blurhash`. For an inlined placeholder image, pass `placeholder-src="data:image/svg+xml, ..."` instead.

::: info
When using BlurHash, set explicit `width` and `height` attributes. See [Hash-Based Placeholders](/guide/placeholders#using-data-attributes) for why.
:::

### Multiple Image Sources

Pass `sources` to render a `<picture>` element with format negotiation and art direction. Each entry becomes a `<source>` child:

```vue
<script setup lang="ts">
import type { UnLazySource } from 'unlazy'
import { UnLazyImage } from '@unlazy/vue/components'

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
    :width="640"
    :height="427"
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
    :blurhash="blurhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    preload
  />
</template>
```
