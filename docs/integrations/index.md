# Integrations

unlazy supports lazy loading images in your framework of choice. Each package provides a `UnLazyImage` component as a drop-in replacement for the native `<img>` element.

## Available Integrations

- [Vue](/integrations/vue)
- [React](/integrations/react)
- [Solid](/integrations/solid)
- [Svelte](/integrations/svelte)
- [Nuxt](/integrations/nuxt), which also decodes [hash-based placeholders](/guide/placeholders) (BlurHash and ThumbHash) on the server

To decode hashes on the server in another framework, see [Server-Side Rendering](/advanced/ssr).

## `UnLazyImage` Props

Every `UnLazyImage` component takes these props, typed as `UnLazyImageProps` in `unlazy`. Each integration page lists the props and events its component adds.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | String | - | Image source URL to be lazy-loaded. |
| `srcSet` | String | - | Image source set to be lazy-loaded. |
| `sources` | Array | - | Array of [`UnLazySource`](#unlazysource) objects to render a `<picture>` element. |
| `autoSizes` | Boolean | `false` | Whether the `sizes` attribute should be automatically calculated. |
| `blurhash` | String | - | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | - | A ThumbHash string representing the blurry placeholder image. If both are provided, `thumbhash` takes precedence. |
| `placeholderSrc` | String | - | Optional image source URL for a custom placeholder image. Ignored if a hash is provided. [Give each image its own URL](/guide/placeholders#give-every-image-its-own-placeholder-url). |
| `placeholderSize` | Number | `32` | The size of the longer edge for BlurHash decoding, capped at `100`. Ignored for ThumbHash. |
| `preload` | Boolean | `false` | Whether the image should load right away instead of when it nears the viewport, for example the next slide of a slider. The hash placeholder stays until the image has loaded. |
| `loading` | String | `'lazy'` | Loading strategy for the image (`'lazy'` or `'eager'`). `'eager'` without `autoSizes` renders the real sources – see [The Eager Path](/guide/core-web-vitals#the-eager-path). |

## `UnLazySource`

Every `UnLazyImage` component takes a `sources` prop. Each `UnLazySource` entry renders one `<source>` inside a `<picture>`. Every adapter package exports the type, such as `import type { UnLazySource } from '@unlazy/react'`:

<<< @/../packages/unlazy/src/types.ts#UnLazySource{ts}

## Creating Custom Integrations

To create a component for your framework, keep the following in mind:

1. The component should wrap a native `<img>` element with the `loading="lazy"` attribute set.
2. The component should support at least a `src` or `srcset` attribute.
3. Import the [`lazyLoad`](/api/lazy-load) function from the unlazy library and call it with the `HTMLImageElement` as the first argument:

```ts
import { lazyLoad } from 'unlazy'

lazyLoad(target)
```

4. Call the cleanup function returned by `lazyLoad` when the component unmounts or its sources change, and call `lazyLoad` again for the new sources once the DOM shows them. In Vue, for example:

```vue
<script setup lang="ts">
import { lazyLoad } from 'unlazy'
import { ref, watchPostEffect } from 'vue'

const props = defineProps<{ src: string }>()
const target = ref<HTMLImageElement | undefined>()

// Runs after the DOM update, so `lazyLoad` reads the new `data-src`
watchPostEffect((onCleanup) => {
  if (!target.value)
    return

  // Re-run when the source changes
  void props.src
  onCleanup(lazyLoad(target.value))
})
</script>

<template>
  <img ref="target" :data-src="src" loading="lazy">
</template>
```

5. Pass an image with its real `src` or `srcset` in the markup to [`lazyLoad`](/api/lazy-load) too, so it reports the outcome. For an image you do not pass to `lazyLoad`, pass its `load` and `error` events to `reportImageOutcome`, which sets or removes the [`data-error`](/guide/usage#style-a-failed-image) attribute and calls `onImageLoad` or `onImageError`:

```ts
import { reportImageOutcome } from 'unlazy'

const handleOutcome = (event: Event) => reportImageOutcome(image, event, { onImageLoad, onImageError })
image.addEventListener('load', handleOutcome)
image.addEventListener('error', handleOutcome)
```

To take the same props as the official components, pass them to `resolveImageAttributes`. `UnLazyImageAttributes` types its result:

- `image` and `sources`, the attributes of the `<img>` and of every `<source>`, under their HTML names.
- `lazyLoadOptions`, to pass to `lazyLoad` next to your `onImageLoad` and `onImageError`.
- `loadKey`, a string of everything that decides how the image loads. Run `lazyLoad` again when it changes instead of on every new props object, so an inline `sources` array does not reload the image.
