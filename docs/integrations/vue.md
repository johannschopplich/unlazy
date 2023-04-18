# Vue

Since unlazy is framework-agnostic, integrating it into your Vue app is fairly easy.

## `LazyImage` Component

The `LazyImage` component allows you to easily implement unlazy in your Vue application, providing a smoother image loading experience. The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop and the usage of custom `sizes`. It also enables you to specify a `blurhash` for the blurry placeholder image.

```vue
<script setup lang="ts">
import { lazyLoad } from 'unlazy'

defineProps<{
  blurhash?: string
  autoSizes?: boolean
}>()

const target = ref<HTMLImageElement | undefined>()

onMounted(() => {
  if (target.value) {
    const cleanup = lazyLoad(target.value)
    onBeforeUnmount(cleanup)
  }
})
</script>

<template>
  <img
    ref="target"
    :data-blurhash="blurhash"
    :data-sizes="autoSizes ? 'auto' : undefined"
    loading="lazy"
  >
</template>
```

## Props

The `LazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |

### Installation

## Usage

```html
<!-- Auto-calculate the `sizes` attribute -->
<LazyImage
  srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  :blurhash="blurhash"
  auto-sizes
/>

<!-- Use custom `sizes` -->
<LazyImage
  srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  sizes="100vw"
  :blurhash="blurhash"
/>
```
