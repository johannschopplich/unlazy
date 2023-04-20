# `@unlazy/vue`

unlazy is not only framework-agnostic, but also provides a Vue component that you can use in your Vue application.

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
import { LazyImage } from '@unlazy/vue/components'
</script>

<template>
  <LazyImage
    src="data:image/svg+xml, ..."
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
  />
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

The `LazyImage` component allows you to easily implement unlazy in your Vue application, providing a smoother image loading experience. The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop. It also enables you to specify a `blurhash` for the blurry placeholder image.

### Props

The `LazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `blurhashSize` | Number | The size of the longer edge (width or height) of the decoded BlurHash image, depending on the aspect ratio. This value will be used to calculate the dimensions of the generated blurry placeholder from a BlurHash string. |

## Examples

In both examples, the `sizes` attribute is automatically calculated.

```html
<!-- BlurHash -->
<LazyImage
  :blurhash="blurhash"
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>

<!-- Encoded image in `src` attribute -->
<LazyImage
  src="data:image/svg+xml, ..."
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>
```
