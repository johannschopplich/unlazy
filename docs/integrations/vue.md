# `@unlazy/vue`

Since unlazy is framework-agnostic, integrating it into your Vue app is fairly easy.

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

Import the `LazyImage` component in your Vue single file component and use it in your template:

```vue
<script setup lang="ts">
import { LazyImage } from '@unlazy/vue'
</script>

<template>
  <LazyImage data-srcset="image.jpg" blurhash="..." />
</template>
```

### Global Registration

If you prefer to make the `LazyImage` component globally available, you can register it in your `main.ts` file across your entire Vue application:

```ts
// src/main.ts
import { createApp } from 'vue'
import Unlazy from '@unlazy/vue'
import App from './App.vue'

const app = createApp(App)
app.use(Unlazy)
app.mount('#app')
```

## `LazyImage` Component

The `LazyImage` component allows you to easily implement unlazy in your Vue application, providing a smoother image loading experience. The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop and the usage of custom `sizes`. It also enables you to specify a `blurhash` for the blurry placeholder image.

### Props

The `LazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |

## Examples

In both examples, the `sizes` attribute is automatically calculated.

```html
<!-- BlurHash -->
<LazyImage
  :blurhash="blurhash"
  srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>

<!-- Encoded image in `src` attribute -->
<LazyImage
  src="data:image/svg+xml, ..."
  srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>
```
