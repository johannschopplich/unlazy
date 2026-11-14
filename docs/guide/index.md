# Getting Started

unlazy is a lazy loading library that leverages native browser APIs. It uses inlined placeholder images or hash-based representations like [BlurHash](/guide/placeholders#blurhash) or [ThumbHash](/guide/placeholders#thumbhash) alongside the native `loading="lazy"` attribute, and targets [Baseline Widely Available](/guide/core-web-vitals#browser-support) browsers.

Images render with blurry placeholders initially, then swap to full-quality versions as they enter the viewport. This improves perceived performance, especially on slow connections.

## Install unlazy

Install the `unlazy` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add unlazy
  ```
  ```bash [yarn]
  yarn add unlazy
  ```
  ```bash [npm]
  npm install unlazy
  ```
:::

unlazy ships as ES modules. Without a bundler, use the [CDN builds](/guide/cdn).

## Mark Up an Image

1. Add the `loading="lazy"` attribute to an `<img>` element that you want to lazily load. You can also use the `<picture>` element to [lazily load images in different formats](/guide/usage#lazy-load-picture-elements).

2. Use `data-src` or `data-srcset` attributes to specify the high-quality image. These prevent browsers from loading images before they enter the viewport and are swapped to standard attributes when loading occurs.

3. Set the `src` attribute with a pre-generated blurry placeholder, or use [hash-based placeholders](/guide/placeholders) (BlurHash or ThumbHash) to generate placeholders on the fly.

```html
<img
  loading="lazy"
  src="blurry placeholder ..."
  data-srcset="image.png"
  data-sizes="auto"
  alt="Descriptive text"
  width="1200"
  height="800"
>
```

With `data-srcset`, set `data-sizes="auto"` to [calculate the `sizes` attribute automatically](/guide/usage#calculate-the-sizes-attribute-automatically).

## Call `lazyLoad`

In your frontend code, import the [`lazyLoad`](/api/lazy-load) function from the library and call it:

```ts
import { lazyLoad } from 'unlazy'

// Process every image with a `data-src` or `data-srcset`
const cleanup = lazyLoad()
```

The `lazyLoad` function returns a cleanup function that removes event listeners and ResizeObservers. Call this when unmounting components or removing images to prevent memory leaks.

Images that are visible in the initial viewport – your hero / LCP image in particular – should **not** be lazy-loaded. Mark them `loading="eager"` instead (see [The Eager Path](/guide/core-web-vitals#the-eager-path)).

From here, [Usage](/guide/usage) covers more use cases, and [Hash-Based Placeholders](/guide/placeholders) sets up BlurHash or ThumbHash placeholders.
