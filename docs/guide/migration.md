# Migrating from v1 to v2

Most users need a single find-and-replace. This page documents every change that can affect existing integrations.

## Breaking Changes

### `loadImage` Removal

The deprecated `loadImage` alias is gone. Replace every call site with `triggerLoad`:

```diff
- import { loadImage } from 'unlazy'
- loadImage(image, onLoad, onError)
+ import { triggerLoad } from 'unlazy'
+ triggerLoad(image, { onImageLoad: onLoad, onImageError: onError })
```

### `triggerLoad` Signature

`triggerLoad` now takes an options object instead of positional callbacks, and returns a disposer that detaches listeners and (for standalone images) aborts the in-flight network fetch:

```diff
- triggerLoad(image, onLoad, onError)
+ const dispose = triggerLoad(image, { onImageLoad: onLoad, onImageError: onError })
+ // Optional: dispose() to cancel before the load completes
```

### `autoSizes` Owns Ongoing Size Tracking

`triggerLoad` is one-shot again – it no longer accepts `updateSizesOnResize`. Ongoing re-resolution of `data-sizes="auto"` lives on [`autoSizes`](/api/auto-sizes), which now accepts `{ updateOnResize: true }` and returns a disposer:

```diff
- triggerLoad(image, { updateSizesOnResize: true })
+ const disposeSizes = autoSizes(image, { updateOnResize: true })
+ const disposeLoad = triggerLoad(image)
+ // Later: disposeSizes(); disposeLoad()
```

For the common case, [`lazyLoad`](/api/lazy-load) keeps `updateSizesOnResize` and delegates to `autoSizes` internally – no caller change needed.

`autoSizes` itself now always returns a function. With no options, the returned disposer is a no-op; with `updateOnResize: true`, it disconnects every `ResizeObserver` created by the call. Passing an `<img>` inside a `<picture>` walks to every `<source data-sizes="auto">` sibling in the same call, replacing the previous need to invoke `autoSizes` separately on each source.

### `isLazyLoadingSupported` Removal

Native `loading="lazy"` is Baseline Widely Available; the feature-detect was used internally to fall back to immediate swap, and that branch is gone. If you imported the helper directly, replace it with:

```ts
const isLazyLoadingSupported = 'loading' in HTMLImageElement.prototype
```

…or assume `true` for any browser in your support matrix.

### Expanded Default Selector

The default selector was:

```
img[loading="lazy"]
```

It is now:

```
img[loading="lazy"], img[loading="eager"][data-src], img[loading="eager"][data-srcset]
```

If you ever wrote `<img loading="eager" data-src="...">` in v1, unlazy silently ignored it. In v2, unlazy processes it through the new eager-priority path (see below). If you were relying on the silent no-op, pass a custom selector.

### Native `error` Event on Preload Failure

Previously, when unlazy's off-DOM preload failed (404, decode error), the visible `<img>` never saw it – only the `onImageError` callback did. v2 dispatches a synthetic `error` event on the visible `<img>`, so native `onerror` / `@error` / `onError` now work for setting a fallback `src`:

```html
<img data-src="hero.jpg" onerror="this.src='/fallback.jpg'">
```

If you bind both `onImageError` and a native error listener, both fire – pick whichever surface fits your app.

### Picture-Element Callback Parity

`onImageLoad` and `onImageError` now fire once when the browser resolves a source on `<img>` elements inside `<picture>`. No code change required.

## New Behavior

### Eager-Priority Path

Images with `loading="eager"` and a `data-src` or `data-srcset` attribute get the above-the-fold treatment – see [`lazyLoad` → How It Works](/api/lazy-load#how-it-works) for the exact behavior and the [Core Web Vitals guide](/guide/core-web-vitals) for when to reach for it.

Use this for your hero / LCP image:

```html
<img
  loading="eager"
  data-src="hero.jpg"
  width="1600"
  height="900"
  alt="Sunset"
>
```

### Idempotent `lazyLoad()`

Calling `lazyLoad()` twice on an already-processed image used to log a spurious `Missing data-src or data-srcset` error because the first call removed those attributes. In v2, processed images are tracked and silently skipped on subsequent calls.

Result: you can safely re-invoke `lazyLoad()` after inserting images into the DOM without console noise.

### Dev-Mode LCP Warning

unlazy now warns in development when the LCP element is still configured for lazy loading. See the [Core Web Vitals guide](/guide/core-web-vitals#dev-mode-lcp-warning).

### `sources` Prop Across Adapters

The `sources` prop is no longer Nuxt-only. Every adapter now renders a `<picture>` when you pass an array of `UnLazySource` objects:

```ts
import type { UnLazySource } from 'unlazy'

const sources: UnLazySource[] = [
  { type: 'image/avif', srcSet: 'hero.avif 1x, hero@2x.avif 2x' },
  { media: '(max-width: 600px)', srcSet: 'hero-mobile.jpg', width: 480, height: 640 },
]
```

Each entry becomes a `<source>` child with `type`, `media`, `width`, `height`, and `data-sizes="auto"` support. Pass `updateSizesOnResize: true` to [`lazyLoad`](/api/lazy-load) (or `{ updateOnResize: true }` directly to [`autoSizes`](/api/auto-sizes)) to re-resolve `<source data-sizes="auto">` siblings on viewport resize.

### Vue / Nuxt: `@image-load` and `@image-error` Emits

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

## Installation

```sh
pnpm add unlazy@2
```
