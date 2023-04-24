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

Import the `UnLazyImage` component in your Vue single file component and use it in your template:

```vue
<script setup lang="ts">
import { UnLazyImage } from '@unlazy/vue/components'
</script>

<template>
  <UnLazyImage
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

## `UnLazyImage` Component

The `UnLazyImage` component allows you to easily implement unlazy in your Vue application, providing a smoother image loading experience. The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop. It also enables you to specify a `blurhash` for the blurry placeholder image.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | A ThumbHash string representing the blurry placeholder image. |
| `placeholderSize` | Number | The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. |
| `immediate` | A flag to indicate whether the image should be loaded immediately. |

## Examples

::: info
In each example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::

::: code-group
  ```vue [BlurHash]
  <UnLazyImage
    :blurhash="blurhash"
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
  />
  ```
  ```vue [ThumbHash]
  <UnLazyImage
    :thumbhash="thumbhash"
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
  />
  ```
  ```vue [Inlined placeholder image]
  <UnLazyImage
    src="data:image/svg+xml, ..."
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
  />
  ```
:::
