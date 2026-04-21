# Migrating from v1 to v2

unlazy 2.0 is a focused release that aligns the library with current lazy-loading best practices. Most users need a single find-and-replace. This page documents every change that can affect existing integrations.

## Breaking Changes

### `loadImage` Has Been Removed

The deprecated `loadImage` alias is gone. It has been marked `@deprecated` since v1 with a note that it would be removed in the next major. Replace every call site with `triggerLoad`:

```diff
- import { loadImage } from 'unlazy'
- loadImage(image, onLoad, onError)
+ import { triggerLoad } from 'unlazy'
+ triggerLoad(image, onLoad, onError)
```

Both functions have identical signatures – this is purely a rename.

### `isLazyLoadingSupported` Has Been Removed

Native `loading="lazy"` is Baseline Widely Available; the feature-detect was used internally to fall back to immediate swap, and that branch is gone. If you imported the helper directly, replace it with:

```ts
const isLazyLoadingSupported = 'loading' in HTMLImageElement.prototype
```

…or simply assume `true` for any browser in your support matrix.

### Default Selector Now Matches Eager Images with `data-src`

The default selector was:

```
img[loading="lazy"]
```

It is now:

```
img[loading="lazy"], img[loading="eager"][data-src], img[loading="eager"][data-srcset]
```

If you ever wrote `<img loading="eager" data-src="...">` in v1, unlazy silently ignored it. In v2, unlazy processes it through the new eager-priority path (see below). If you were relying on the silent no-op, pass a custom selector.

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

During development, unlazy now warns when the LCP element is still configured for lazy loading:

```
[unlazy] LCP element is configured for lazy loading.
Set `loading="eager"` to improve Largest Contentful Paint.
```

The warning can be stripped from production builds via the [`__UNLAZY_LOGGING__`](/advanced/build-flags#disable-client-logging) build flag.

## No Other Breaking Changes

- `lazyLoad`, `triggerLoad`, `autoSizes`, `createPlaceholderFromHash` – unchanged signatures.
- SSR decoders (`unlazy/blurhash`, `unlazy/thumbhash`) – unchanged.
- `isCrawler` – unchanged.
- `UnLazyLoadOptions` – unchanged.
- Framework component props – unchanged except that `priority`/`loading="eager"` now does what you'd expect.

## Upgrading

```sh
pnpm add unlazy@2
```

Then:

1. Replace `loadImage` with `triggerLoad` across your codebase.
2. Drop any imports of `isLazyLoadingSupported`; inline the one-line check if you still need it.
3. If you were using `<img loading="eager" data-src="...">` as a no-op, either remove the `data-src` or switch to the new eager-priority path intentionally.
4. Check the [Core Web Vitals guide](/guide/core-web-vitals) and mark your hero image with `loading="eager"` if you haven't already.
