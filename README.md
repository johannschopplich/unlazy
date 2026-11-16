[![unlazy library](./docs/public/og.jpg)](https://unlazy.byjohann.dev)

# unlazy

[![npm version][npm-version-src]][npm-version-href]
[![bundle][bundle-src]][bundle-href]

Native image lazy loading for vanilla JS, Vue, React, Svelte, Solid and Nuxt. Built around the `loading="lazy"` attribute, with [BlurHash](https://unlazy.byjohann.dev/guide/placeholders#blurhash) / [ThumbHash](https://unlazy.byjohann.dev/guide/placeholders#thumbhash) placeholders, a dedicated above-the-fold priority path, and a dev-mode LCP warning so you never ship a lazy-loaded hero image by accident.

## Features

- 🎀 **Native**: Utilizes the `loading="lazy"` attribute
- 🎛️ **Framework-agnostic**: Works with any framework or no framework at all
- 🌊 **BlurHash & ThumbHash support**: SSR & client-side [BlurHash](https://blurha.sh) and [ThumbHash](https://github.com/evanw/thumbhash) decoding
- ⚡ **Core Web Vitals-aware**: Eager-priority path for above-the-fold images, dev-mode LCP warning
- 🪄 **Sizing**: Automatically calculates the `sizes` attribute
- 🔍 **SEO-friendly**: Detects search engine bots and preloads all images
- 🎟 **`<picture>`**: Art direction and format selection with multiple sources
- 🏎 **Auto-initialize**: Usable without a build step

## Installation

> [📖 Read the documentation](https://unlazy.byjohann.dev)

```bash
# pnpm
pnpm add unlazy

# npm
npm i unlazy
```

For a framework, install its integration instead:

- **Vue**: [`@unlazy/vue`](https://unlazy.byjohann.dev/integrations/vue)
- **Nuxt**: [`@unlazy/nuxt`](https://unlazy.byjohann.dev/integrations/nuxt)
- **React**: [`@unlazy/react`](https://unlazy.byjohann.dev/integrations/react)
- **Solid**: [`@unlazy/solid`](https://unlazy.byjohann.dev/integrations/solid)
- **Svelte**: [`@unlazy/svelte`](https://unlazy.byjohann.dev/integrations/svelte)

## Basic Usage

Mark an image with `loading="lazy"` and put its source into `data-src` or `data-srcset`:

```html
<img loading="lazy" data-src="image.jpg" width="640" height="360" alt="Descriptive text">
```

Then import the [`lazyLoad`](https://unlazy.byjohann.dev/api/lazy-load) function and call it without arguments to process all matching images:

```ts
import { lazyLoad } from 'unlazy'

// Processes every image with a `data-src` or `data-srcset`
lazyLoad()
```

For above-the-fold images (your hero / LCP image), use `loading="eager"`. unlazy swaps the real source immediately and applies `fetchpriority="high"` for you:

```html
<img loading="eager" data-src="hero.jpg" width="1600" height="900" alt="Sunset">
```

To target specific images, pass a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to [`lazyLoad`](https://unlazy.byjohann.dev/api/lazy-load).

## 💻 Development

1. Clone this repository
2. Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
3. Install dependencies using `pnpm install`
4. Run `pnpm run dev:prepare`
5. Start a development server using `pnpm run dev` inside one of the framework packages, such as `packages/vue`

## License

[MIT](./LICENSE) License © 2023-PRESENT [Johann Schopplich](https://github.com/johannschopplich)

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/unlazy?style=flat
[npm-version-href]: https://npmjs.com/package/unlazy
[bundle-src]: https://img.shields.io/bundlephobia/minzip/unlazy?style=flat
[bundle-href]: https://bundlephobia.com/result?p=unlazy
