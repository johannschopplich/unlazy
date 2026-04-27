# Server-Side Rendering

unlazy's hash decoders run in any JavaScript runtime that exposes `globalThis.btoa` and `globalThis.atob` – [Node ≥ 16](https://nodejs.org/api/globals.html#btoadata), Deno, Bun, [Cloudflare Workers](https://developers.cloudflare.com/workers/runtime-apis/web-standards/), Vercel Edge, and RSC servers. They never import `node:` modules or `Buffer`. Decoding on the server keeps the placeholder visible on first paint and removes the client-side decode step entirely.

## The Output Contract

The server emits the placeholder inline:

```html
<img
  src="data:image/png;base64,iVBORw0KGgo…"
  data-src="real.jpg"
  data-thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
  loading="lazy"
  width="800"
  height="600"
>
```

After hydration, `lazyLoad` swaps `data-src` into `src` when the image enters the viewport. The encoder is deterministic – the same hash produces a byte-identical data URI on the server and on the client – so [Vue](https://vuejs.org/guide/scaling-up/ssr.html) and React see no hydration mismatch.

::: warning
For above-the-fold images, set `loading="eager"` even with an SSR placeholder – the LCP candidate is the real image, not the placeholder. The [dev-mode LCP warning](/guide/core-web-vitals#dev-mode-lcp-warning) catches misconfigurations.
:::

## Render-Time Recipe

Pre-compute the placeholder during render and inline it as `src`:

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

The same primitive works elsewhere – React Server Components import from `unlazy/thumbhash` directly and put the result on `<img src={…}>`; Astro frontmatter and SvelteKit `+page.server.ts` follow the same pattern. The only framework-specific detail is where the client-side `lazyLoad()` runs (a `'use client'` boundary in RSC, the SvelteKit `+page.svelte` script, the Astro [client directive](https://docs.astro.build/en/reference/directives-reference/) of your choice).

## Nuxt: First-Class SSR

[`@unlazy/nuxt`](/integrations/nuxt) integrates the contract end-to-end: `ssr: true` (default) decodes the hash per-request, inlines the data URI as `src`, and the client mounts `lazyLoad` with `hash: false` so the decoder never reruns in the browser. Override per-component with `:ssr="false"`, or globally via `nuxt.config.ts`.

## Performance and Caching

The decode path is hash → 32×32 RGBA → uncompressed PNG → base64. [`fast-blurhash`](https://github.com/mad-gooze/fast-blurhash) reports up to 70% faster decoding than the reference implementation; absolute timings depend on hash length and output size. For routes that render many images sharing a small set of hashes, cache by hash key – the encoder is pure, so an LRU keyed on the hash string is enough. For static catalogues, prefer build-time generation over per-request decode.

## Content Security Policy

Allow `data:` URIs in `img-src` (or `default-src`). Without this, browsers block the inlined PNG and the placeholder fails to render. See [content-security-policy.com](https://content-security-policy.com/img-src/).
