# Server-Side Rendering

unlazy's hash decoders are pure functions that work in Node, Deno, Bun, and Workers. Generating placeholders on the server keeps them small, eliminates a client-side decode step, and ensures the placeholder is visible on first paint – even before JavaScript loads.

## When to Decode on the Server

- You want zero client-side decode cost for placeholders.
- You already generate BlurHash / ThumbHash strings during image processing (CMS, pipeline, asset server).
- You need visible placeholders for users with JavaScript disabled.

## The Subpath Exports

The decoders are tree-shakable subpath entries. Import only the one you use:

```ts
import { createPngDataUri } from 'unlazy/blurhash'
// or
import { createPngDataUri } from 'unlazy/thumbhash'
```

These entries are SSR-safe – they have no dependency on `window` or `document`.

## Vue 3

Pre-compute the placeholder in your data loader, pass it as a prop:

```vue
<script setup lang="ts">
import { createPngDataUri } from 'unlazy/thumbhash'

const props = defineProps<{
  src: string
  thumbhash: string
  alt: string
  width: number
  height: number
}>()

// Runs on the server; the result is serialized into the HTML payload
const placeholder = createPngDataUri(props.thumbhash)
</script>

<template>
  <img
    :src="placeholder"
    :data-src="src"
    :data-thumbhash="thumbhash"
    :alt="alt"
    :width="width"
    :height="height"
    loading="lazy"
  >
</template>
```

Call `lazyLoad` from your client entry point – it is browser-only and should not run during SSR:

```ts
import { lazyLoad } from 'unlazy'

lazyLoad()
```

## React Server Components

In RSC, `createPngDataUri` runs on the server with zero client payload:

```tsx
import { createPngDataUri } from 'unlazy/thumbhash'

export function ProductImage({ src, thumbhash, alt }: Props) {
  const placeholder = createPngDataUri(thumbhash)

  return (
    <img
      src={placeholder}
      data-src={src}
      data-thumbhash={thumbhash}
      alt={alt}
      width={800}
      height={600}
      loading="lazy"
    />
  )
}
```

Call `lazyLoad()` from a `'use client'` component that mounts once at the app root.

## Astro

Astro islands run on the server by default – `createPngDataUri` fits naturally:

```astro
---
import { createPngDataUri } from 'unlazy/thumbhash'

const { src, thumbhash, alt } = Astro.props
const placeholder = createPngDataUri(thumbhash)
---

<img
  src={placeholder}
  data-src={src}
  data-thumbhash={thumbhash}
  alt={alt}
  width="800"
  height="600"
  loading="lazy"
/>
```

## Nuxt

Nuxt users should prefer the [`@unlazy/nuxt`](/integrations/nuxt) module – it handles SSR decoding and client hydration automatically.

## Using Your Own LQIP

If you already have a tiny WebP, JPEG, or AVIF preview from your image pipeline, you don't need hash decoders at all – put the data URL directly into `src`. See [Using Your Own Placeholder](/guide/placeholders#using-your-own-placeholder) for the full pattern.
