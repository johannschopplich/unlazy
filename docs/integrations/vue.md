# `@unlazy/vue`

The Vue integration provides an `UnLazyImage` component for your Vue application.

## Installation

Install the `@unlazy/vue` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add @unlazy/vue
  ```
  ```bash [yarn]
  yarn add @unlazy/vue
  ```
  ```bash [npm]
  npm install @unlazy/vue
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

Once `@unlazy/vue` is imported, Vue's `GlobalComponents` type knows `UnLazyImage`, so its props type-check in every template.

## `UnLazyImage` Component

`UnLazyImage` renders a lazy-loaded `<img>`, or a `<picture>` when you pass `sources`.

### Props

`UnLazyImage` takes the [props every integration shares](/integrations/#unlazyimage-props).

The component also accepts all standard `<img>` HTML attributes via Vue's attribute inheritance.

### Emitted Events

| Event | Payload | Description |
| --- | --- | --- |
| `image-load` | `HTMLImageElement` | Fired once when the real image finishes loading. |
| `image-error` | `HTMLImageElement, Event` | Fired when the image fails to load. |

A native `@error` listener falls through to the `<img>` and fires both for the browser's errors and for the synthetic `error` event unlazy dispatches when its preload fails. Use `@image-error` for the image element with a typed payload.

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

Pass an array of [`UnLazySource`](/integrations/#unlazysource) objects as `sources` to render a `<picture>` element with format negotiation and art direction. Each entry becomes a `<source>` child:

```vue
<script setup lang="ts">
import type { UnLazySource } from '@unlazy/vue/components'
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
