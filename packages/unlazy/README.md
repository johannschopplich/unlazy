# unlazy

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]

Universal lazy loading library leveraging native browser APIs.

- 🎀 **Native**: Utilizes the `loading="lazy"` attribute
- 🌊 **BlurHash & ThumbHash support**: SSR & client-side decoding
- ⚡ **Core Web Vitals-aware**: Eager-priority path for above-the-fold images, dev-mode LCP warning
- 🎟 **`<picture>`**: Art direction with automatic `sizes`

## Installation

```bash
# pnpm
pnpm add unlazy

# npm
npm i unlazy
```

## Quick Start

```html
<img
  loading="lazy"
  src="data:image/svg+xml, ..."
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  data-sizes="auto"
  alt="Descriptive text"
  width="640"
  height="360"
>
```

```ts
import { lazyLoad } from 'unlazy'

// Processes `img[loading="lazy"]` and `img[loading="eager"][data-src|data-srcset]`
const cleanup = lazyLoad()
```

For above-the-fold / LCP images, use `loading="eager"` – unlazy swaps the source immediately and applies `fetchpriority="high"` for you.

## Documentation

[📖 Read the full documentation](https://unlazy.byjohann.dev), including [hash-based placeholders](https://unlazy.byjohann.dev/guide/placeholders), [Core Web Vitals](https://unlazy.byjohann.dev/guide/core-web-vitals), and [SSR](https://unlazy.byjohann.dev/guide/ssr).

## Migrating from v1

See the [migration guide](https://unlazy.byjohann.dev/guide/migration) for breaking changes in v2.

## License

MIT License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unlazy?style=flat
[npm-version-href]: https://npmjs.com/package/unlazy
[bundle-src]: https://img.shields.io/bundlephobia/minzip/unlazy?style=flat
[bundle-href]: https://bundlephobia.com/result?p=unlazy
