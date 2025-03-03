[![unlazy library](./.github/og.jpg)](https://unlazy.byjohann.dev)

# unlazy

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]

Universal lazy loading library leveraging native browser APIs. It is intended to be used with the `loading="lazy"` attribute alongside (blurry) placeholder images and with a [BlurHash](https://unlazy.byjohann.dev/placeholders/blurhash) or [ThumbHash](https://unlazy.byjohann.dev/placeholders/thumbhash) string.

## Features

- 🎀 **Native**: Utilizes the `loading="lazy"` attribute
- 🎛️ **Framework-agnostic**: Works with any framework or no framework at all
- 🌊 **BlurHash & ThumbHash support**: SSR & client-side [BlurHash](https://blurha.sh) and [ThumbHash](https://github.com/evanw/thumbhash) decoding
- 🪄 **Sizing**: Automatically calculates the `sizes` attribute
- 🔍 **SEO-friendly**: Detects search engine bots and preloads all images
- 🎟 **`<picture>`**: Supports multiple image tags
- 🏎 **Auto-initialize**: Usable without a build step
- 🎉 **Fade Transitions**: Optionally fade (in ms) between BlurHash and ThumbHash to your loaded image with `:transition="500"`

## Setup

> [📖 Read the documentation](https://unlazy.byjohann.dev)

```bash
# pnpm
pnpm add -D unlazy

# npm
npm i -D unlazy
```

## Basic Usage

> [📖 Read the documentation](https://unlazy.byjohann.dev)

To apply lazy loading to all images with the `loading="lazy"` attribute, import the [`lazyLoad`](https://unlazy.byjohann.dev/api/lazy-load) function and call it without any arguments:

```ts
import { lazyLoad } from 'unlazy'

// Apply lazy loading for all images by the selector `img[loading="lazy"]`
lazyLoad()
```

You can target specific images by passing a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load to [`lazyLoad`](https://unlazy.byjohann.dev/api/lazy-load).

## 💻 Development

1. Clone this repository
2. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
3. Install dependencies using `pnpm install`
4. Run `pnpm run dev:prepare`
5. Start development server using `pnpm run dev` inside the one of the `packages` directories

## License

[MIT](./LICENSE) License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unlazy?style=flat
[npm-version-href]: https://npmjs.com/package/unlazy
[bundle-src]: https://img.shields.io/bundlephobia/minzip/unlazy?style=flat
[bundle-href]: https://bundlephobia.com/result?p=unlazy
