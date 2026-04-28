# @unlazy/react

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]

React component for [unlazy](https://unlazy.byjohann.dev), the universal lazy loading library leveraging native browser APIs.

- 🎀 **Native**: Utilizes the `loading="lazy"` attribute
- 🌊 **BlurHash & ThumbHash support**: SSR & client-side decoding
- ⚡ **Core Web Vitals-aware**: Eager-priority path for above-the-fold images, dev-mode LCP warning
- 🎟 **`<picture>`**: Art direction with automatic `sizes`

## Installation

```bash
# pnpm
pnpm add @unlazy/react

# npm
npm i @unlazy/react
```

## Quick Start

```tsx
import { UnLazyImage } from '@unlazy/react'

export function Hero() {
  return (
    <UnLazyImage
      blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
      onImageLoad={img => console.log('Loaded:', img.src)}
    />
  )
}
```

## Documentation

[📖 Read the full documentation](https://unlazy.byjohann.dev/integrations/react), including [hash-based placeholders](https://unlazy.byjohann.dev/guide/placeholders), [Core Web Vitals](https://unlazy.byjohann.dev/guide/core-web-vitals), and [SSR](https://unlazy.byjohann.dev/guide/ssr).

## Migrating from v1

See the [migration guide](https://unlazy.byjohann.dev/guide/migration) for breaking changes in v2.

## License

MIT License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@unlazy/react?style=flat
[npm-version-href]: https://npmjs.com/package/@unlazy/react
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@unlazy/react?style=flat
[bundle-href]: https://bundlephobia.com/result?p=@unlazy/react
