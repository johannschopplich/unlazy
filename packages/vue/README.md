# @unlazy/vue

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]

Vue component for [unlazy](https://unlazy.byjohann.dev), the universal lazy loading library leveraging native browser APIs.

- 🎀 **Native**: Utilizes the `loading="lazy"` attribute
- 🌊 **BlurHash & ThumbHash support**: SSR & client-side decoding
- ⚡ **Core Web Vitals-aware**: Eager-priority path for above-the-fold images, dev-mode LCP warning
- 🎟 **`<picture>`**: Art direction with automatic `sizes`

## Installation

```bash
# pnpm
pnpm add @unlazy/vue

# npm
npm i @unlazy/vue
```

## Quick Start

```vue
<script setup lang="ts">
import { UnLazyImage } from '@unlazy/vue/components'
</script>

<template>
  <UnLazyImage
    blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    @image-load="img => console.log('Loaded:', img.src)"
  />
</template>
```

You can also register the component globally; see the [Vue integration guide](https://unlazy.byjohann.dev/integrations/vue).

## Documentation

[📖 Read the full documentation](https://unlazy.byjohann.dev/integrations/vue), including [hash-based placeholders](https://unlazy.byjohann.dev/guide/placeholders), [Core Web Vitals](https://unlazy.byjohann.dev/guide/core-web-vitals), and [SSR](https://unlazy.byjohann.dev/guide/ssr).

## Migrating from v1

See the [migration guide](https://unlazy.byjohann.dev/guide/migration) for breaking changes in v2, including the `@loaded` → `@image-load` rename and the new `@image-error` event.

## License

MIT License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@unlazy/vue?style=flat
[npm-version-href]: https://npmjs.com/package/@unlazy/vue
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@unlazy/vue?style=flat
[bundle-href]: https://bundlephobia.com/result?p=@unlazy/vue
