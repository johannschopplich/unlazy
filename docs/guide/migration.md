---
outline: [2, 3]
---

# Migration Guide

## Migrating From v2 to v3

Install v3 of `unlazy` or of your adapter package first:

```sh
pnpm add unlazy@3
# or, for example
pnpm add @unlazy/vue@3
```

The [release notes](https://github.com/johannschopplich/unlazy/releases) list the fixes that need no change.

### Code to Change

These changes need an edit in your code, markup, or build setup.

#### `@unlazy/core` Is Now `unlazy`

v3 ships no `@unlazy/core`. Import from `unlazy` instead:

```diff
- import { lazyLoad } from '@unlazy/core'
+ import { lazyLoad } from 'unlazy'
- import { createPngDataUri } from '@unlazy/core/blurhash'
+ import { createPngDataUri } from 'unlazy/blurhash'
- import { createPngDataUri } from '@unlazy/core/thumbhash'
+ import { createPngDataUri } from 'unlazy/thumbhash'
```

The helpers only `@unlazy/core` exported – `isSSR`, `toElementArray`, `debounce`, `createIndexedImagePlaceholder`, and `rgbaToDataUri` – are gone. Copy the ones you used into your code.

#### Import `UnLazySource` From Your Adapter Package

Installing an adapter does not add `unlazy` to your dependencies, so import `UnLazySource` from the adapter package:

```diff
- import type { UnLazySource } from 'unlazy'
+ import type { UnLazySource } from '@unlazy/react'
```

#### ES Modules Only

Every package ships ES modules only, without a CommonJS build or the `main`, `module`, and `types` fields. Replace `require()` with `import`. In TypeScript, set `moduleResolution` to `"bundler"` or `"nodenext"`, since `"node"` reads no `exports` field and no longer finds the types.

#### Default Selector Is `img[data-src], img[data-srcset]`

`lazyLoad()` without a selector used to match:

```
img[loading="lazy"], img[loading="eager"][data-src], img[loading="eager"][data-srcset]
```

It now matches:

```
img[data-src], img[data-srcset]
```

An image with a `data-src` but no `loading` attribute used to be skipped. It now loads right away on the [eager path](/guide/core-web-vitals#the-eager-path). Add `loading="lazy"` to every image that should wait for the viewport:

```diff
- <img data-src="photo.jpg" alt="Photo">
+ <img loading="lazy" data-src="photo.jpg" alt="Photo">
```

An `<img loading="lazy">` without `data-src` or `data-srcset` is no longer matched, so it no longer logs the missing-attribute error.

#### `triggerLoad` Sets `loading="eager"`

`triggerLoad` and the `preload` option switch the image to `loading="eager"` as they swap in its source, so an off-screen image loads right away in every browser. Styles or scripts that select `img[loading="lazy"]` no longer match such an image afterwards. Select it by a class of your own instead.

#### `@unlazy/nuxt` Requires Nuxt 4

Upgrade your app to Nuxt 4 first – see [Migrating to Nuxt 4](https://nuxt.com/docs/4.x/getting-started/upgrade#migrating-to-nuxt-4).

### Changed Behavior

These changes need no edit. Drop a workaround if you wrote one.

- Eager images and crawlers no longer get a hash placeholder, since the real image would replace it before it is painted. A `data-blurhash` or `data-thumbhash` on an eager image does nothing.
- With `loading="eager"` and without `autoSizes`, `UnLazyImage` renders the real `src`, `srcset`, and `sources` and no placeholder. For the LCP image, pass `sizes` instead of `autoSizes` – see [The Eager Path](/guide/core-web-vitals#the-eager-path).
- `onImageLoad` fires once the visible image has loaded the real source, not once the preload has.
- `lazyLoad` now calls `onImageLoad` or `onImageError` for an image with its own `src` or `srcset` and no `data-src` or `data-srcset`, even when it settled before the call, and a failed one gets `data-error`. It no longer replaces their `src` with the hash placeholder or logs the missing-attribute error. Drop the `load` and `error` listeners you added for such an image, or its callback runs twice.
- A failed image keeps its placeholder, in a `<picture>` too, and gets a `data-error` attribute until a later load succeeds – see [Style a Failed Image](/guide/usage#style-a-failed-image).
- A changed `src`, `srcSet`, or `sources` loads the new image in every adapter.
- `placeholderSize` is capped at `100`, so a larger value now decodes a 100-pixel BlurHash.
- A BlurHash decodes square unless the image's `width` and `height` are both known. Nuxt's server-decoded BlurHash is square without both attributes and without `placeholderRatio`.
- React: the package carries the `'use client'` directive. Drop a `'use client'` wrapper you added around `UnLazyImage`.
- Solid: the `solid` export condition lets SolidStart render `UnLazyImage` on the server. Drop a `clientOnly` wrapper you added for it.
- Nuxt: `placeholderRatio` defaults to the ratio of the `width` and `height` attributes, so drop a `placeholder-ratio` that repeats them. `@unlazy/nuxt` no longer defines `__UNLAZY_HASH_DECODING__` as `true`, so a `false` define of yours now drops the hash placeholder of lazy-loaded images with `ssr: false`.
- The missing-attribute error, the hash decoder failure error, and the LCP warning appear only where your bundler resolves the `development` export condition – see [Disable Client Logging](/advanced/build-flags#disable-client-logging). The CDN builds log nothing. Drop a `__UNLAZY_LOGGING__` define of `false` that only kept the logs out of production.

## Migrating From v1 to v2

Most users need a single find-and-replace. Install v2 first:

```sh
pnpm add unlazy@2
```

### Breaking Changes

#### `loadImage` Removal

The deprecated `loadImage` alias is gone. Replace every call site with `triggerLoad`:

```diff
- import { loadImage } from 'unlazy'
- loadImage(image, onLoad, onError)
+ import { triggerLoad } from 'unlazy'
+ triggerLoad(image, { onImageLoad: onLoad, onImageError: onError })
```

#### `triggerLoad` Signature

`triggerLoad` now takes an options object instead of positional callbacks, and returns a cleanup function that detaches listeners and (for standalone images) aborts the in-flight network fetch:

```diff
- triggerLoad(image, onLoad, onError)
+ const cleanup = triggerLoad(image, { onImageLoad: onLoad, onImageError: onError })
+ // Optional: cleanup() to cancel before the load completes
```

#### `isLazyLoadingSupported` Removal

Native `loading="lazy"` is Baseline Widely Available, so v2 drops the helper along with the fallback to an immediate swap. If you imported the helper directly, replace it with:

```ts
const isLazyLoadingSupported = 'loading' in HTMLImageElement.prototype
```

…or assume `true` for any browser in your support matrix.

#### Expanded Default Selector

The default selector was:

```
img[loading="lazy"]
```

It is now:

```
img[loading="lazy"], img[loading="eager"][data-src], img[loading="eager"][data-srcset]
```

If you ever wrote `<img loading="eager" data-src="...">` in v1, unlazy silently ignored it. In v2, unlazy processes it through the new [eager-priority path](/guide/core-web-vitals#the-eager-path). If you were relying on the silent no-op, pass a custom selector.

#### Native `error` Event on Preload Failure

Previously, when unlazy's off-DOM preload failed (404, decode error), the visible `<img>` never saw it – only the `onImageError` callback did. v2 dispatches a synthetic `error` event on the visible `<img>`, so native `onerror` / `@error` / `onError` now work for setting a fallback `src`:

```html
<img loading="lazy" data-src="hero.jpg" onerror="this.src='/fallback.jpg'">
```

If you bind both `onImageError` and a native error listener, both fire – pick whichever surface fits your app.

#### Vue / Nuxt: `@image-load` and `@image-error` Emits

The Vue and Nuxt adapters now expose a symmetric pair of emits aligned with the core option names:

| v1 | v2 |
| --- | --- |
| `@loaded="(image) => …"` | `@image-load="(image) => …"` |
| – | `@image-error="(image, error) => …"` |

```diff
- <UnLazyImage @loaded="onLoaded" />
+ <UnLazyImage @image-load="onImageLoad" @image-error="onImageError" />
```

The declared `@error` emit was removed.

::: info
Existing `@error` listeners keep working via Vue's attribute fallthrough – they fire for native errors and for the synthetic preload failure. Reach for `@image-error` only when you want both the wrapped image element and the event.
:::

### New Behavior

- unlazy now warns in development when the LCP element is still configured for lazy loading – see [Dev-Mode LCP Warning](/guide/core-web-vitals#dev-mode-lcp-warning).
