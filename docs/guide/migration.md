# Migrating From v1 to v2

Most users need a single find-and-replace. This page documents every change that can affect existing integrations. Install v2 first:

```sh
pnpm add unlazy@2
```

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

`triggerLoad` now takes an options object instead of positional callbacks, and returns a cleanup function that detaches listeners and (for standalone images) aborts the in-flight network fetch:

```diff
- triggerLoad(image, onLoad, onError)
+ const cleanup = triggerLoad(image, { onImageLoad: onLoad, onImageError: onError })
+ // Optional: cleanup() to cancel before the load completes
```

### `isLazyLoadingSupported` Removal

Native `loading="lazy"` is Baseline Widely Available, so v2 drops the helper along with the fallback to an immediate swap. If you imported the helper directly, replace it with:

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

If you ever wrote `<img loading="eager" data-src="...">` in v1, unlazy silently ignored it. In v2, unlazy processes it through the new [eager-priority path](/guide/core-web-vitals#the-eager-path). If you were relying on the silent no-op, pass a custom selector.

### Native `error` Event on Preload Failure

Previously, when unlazy's off-DOM preload failed (404, decode error), the visible `<img>` never saw it – only the `onImageError` callback did. v2 dispatches a synthetic `error` event on the visible `<img>`, so native `onerror` / `@error` / `onError` now work for setting a fallback `src`:

```html
<img loading="lazy" data-src="hero.jpg" onerror="this.src='/fallback.jpg'">
```

If you bind both `onImageError` and a native error listener, both fire – pick whichever surface fits your app.

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

## New Behavior

- `onImageLoad` and `onImageError` now fire once when the browser resolves a source on `<img>` elements inside `<picture>`.
- [`autoSizes`](/api/auto-sizes) now accepts `{ updateOnResize: true }`, always returns a cleanup function, and resolves every `<source data-sizes="auto">` sibling when passed an `<img>` inside a `<picture>`.
- unlazy now warns in development when the LCP element is still configured for lazy loading – see [Dev-Mode LCP Warning](/guide/core-web-vitals#dev-mode-lcp-warning).
- The `sources` prop is no longer Nuxt-only. Every adapter now renders a `<picture>` when you pass an array of [`UnLazySource`](/integrations/#unlazysource) objects.
