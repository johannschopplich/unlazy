# @unlazy/svelte

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]

Svelte 5 component for [unlazy](https://unlazy.byjohann.dev), the universal lazy loading library leveraging native browser APIs.

- 🎀 **Native**: Utilizes the `loading="lazy"` attribute
- 🌊 **BlurHash & ThumbHash support**: SSR & client-side decoding
- ⚡ **Core Web Vitals-aware**: Eager-priority path for above-the-fold images, dev-mode LCP warning
- 🎟 **`<picture>`**: Art direction with automatic `sizes`

## Installation

```bash
# pnpm
pnpm add @unlazy/svelte

# npm
npm i @unlazy/svelte
```

Requires **Svelte 5+** (uses runes).

## Quick Start

```svelte
<script lang="ts">
  import { UnLazyImage } from '@unlazy/svelte'
</script>

<UnLazyImage
  blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
  srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
  autoSizes
  onImageLoad={img => console.log('Loaded:', img.src)}
/>
```

## Documentation

[📖 Read the full documentation](https://unlazy.byjohann.dev/integrations/svelte), including [hash-based placeholders](https://unlazy.byjohann.dev/guide/placeholders), [Core Web Vitals](https://unlazy.byjohann.dev/guide/core-web-vitals), and [SSR](https://unlazy.byjohann.dev/guide/ssr).

## Migrating from v1

See the [migration guide](https://unlazy.byjohann.dev/guide/migration) for breaking changes in v2.

## License

MIT License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@unlazy/svelte?style=flat
[npm-version-href]: https://npmjs.com/package/@unlazy/svelte
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@unlazy/svelte?style=flat
[bundle-href]: https://bundlephobia.com/result?p=@unlazy/svelte
