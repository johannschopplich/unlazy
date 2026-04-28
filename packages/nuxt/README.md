# @unlazy/nuxt

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]

Nuxt module for [unlazy](https://unlazy.byjohann.dev), the universal lazy loading library leveraging native browser APIs.

- 🎀 **Native**: Utilizes the `loading="lazy"` attribute
- 🌊 **BlurHash & ThumbHash support**: SSR & client-side decoding
- ⚡ **Core Web Vitals-aware**: Eager-priority path for above-the-fold images, dev-mode LCP warning
- 🎟 **`<picture>`**: Art direction with automatic `sizes`

## Installation

```bash
# pnpm
pnpm add @unlazy/nuxt

# npm
npm i @unlazy/nuxt
```

## Quick Start

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@unlazy/nuxt'],
})
```

The `UnLazyImage` component is auto-imported globally:

```vue
<template>
  <UnLazyImage
    blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
  />
</template>
```

## Documentation

[📖 Read the full documentation](https://unlazy.byjohann.dev/integrations/nuxt), including [hash-based placeholders](https://unlazy.byjohann.dev/guide/placeholders), [Core Web Vitals](https://unlazy.byjohann.dev/guide/core-web-vitals), and [SSR](https://unlazy.byjohann.dev/guide/ssr).

## Migrating from v1

See the [migration guide](https://unlazy.byjohann.dev/guide/migration) for breaking changes in v2, including the `@loaded` → `@image-load` rename and the new `@image-error` event.

## License

MIT License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@unlazy/nuxt?style=flat
[npm-version-href]: https://npmjs.com/package/@unlazy/nuxt
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@unlazy/nuxt?style=flat
[bundle-href]: https://bundlephobia.com/result?p=@unlazy/nuxt
