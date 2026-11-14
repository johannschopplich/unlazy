# `lazyLoad`

The `lazyLoad` function takes a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.

By default it matches:

```
img[data-src], img[data-srcset]
```

An image marked `loading="lazy"` loads as it nears the viewport. Every other matched image – `loading="eager"` or no `loading` attribute at all – loads right away on the [eager path](/guide/core-web-vitals#the-eager-path).

Call `lazyLoad()` again after inserting images into the DOM to process the new ones. A call after the cleanup of an earlier one picks up the images that have not loaded yet, so a framework component can run `lazyLoad` on every mount or source change.

## Type Declarations

<<< @/../packages/unlazy/src/types.ts#UnLazyLoadOptions{ts}

<<< @/../packages/unlazy/src/lazyLoad.ts#lazyLoad{ts}

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `hash` | `boolean \| string` | `true` | Whether to use a hash for generating a blurry placeholder. Can be `true` (auto-detect from `data-blurhash`/`data-thumbhash`), `false` (disabled), or a hash string. |
| `hashType` | `'blurhash' \| 'thumbhash'` | `'blurhash'` | The type of hash to use. Ignored when `hash` is boolean (auto-detected from data attributes). |
| `placeholderSize` | `number` | `32` | The size of the longer edge for BlurHash decoding, capped at `100`. Ignored for ThumbHash. |
| `updateSizesOnResize` | `boolean` | `false` | Re-resolve `data-sizes="auto"` when the rendered size of the image changes – applies to both `<img>` and `<source>` siblings inside a `<picture>`. Internally delegates to [`autoSizes`](/api/auto-sizes); the returned cleanup function disconnects every observer. |
| `preload` | `boolean` | `false` | Load lazy images right away instead of when they near the viewport. The hash placeholder is decoded first and stays until the image has loaded. Internally delegates to [`triggerLoad`](/api/trigger-load). |
| `onImageLoad` | `(image: HTMLImageElement) => void` | - | Callback invoked once the visible image has loaded its real source. |
| `onImageError` | `(image: HTMLImageElement, error: Event) => void` | - | Callback invoked when an image fails to load. A lazy image keeps its placeholder, and the image gets a [`data-error`](/guide/usage#style-a-failed-image) attribute. |

## Return Value

The function returns a cleanup function that removes all event listeners and ResizeObservers created by `lazyLoad`. Call this function when images are no longer needed to prevent memory leaks:

```ts
const cleanup = lazyLoad()

// Later, when cleaning up
cleanup()
```

## How It Works

1. **Eager images get the priority path.** For images not marked `loading="lazy"`:
   - `data-src` / `data-srcset` swap into `src` / `srcset` immediately.
   - `fetchpriority="high"` is set if no value is already present.
   - No hash placeholder is decoded, since the real image would replace it before it is painted.
2. **Crawlers** get the same immediate swap without a hash placeholder, so [search engines](/guide/seo-considerations) see the real image.
3. **Lazy images** get a blurry placeholder from [hash-based placeholders](/guide/placeholders) (BlurHash / ThumbHash) if applicable, and `data-sizes="auto"` is expanded to a real `sizes` value. With `preload: true`, they load right away behind that placeholder.
4. **Viewport timing is handled by the browser** via the native `loading="lazy"` attribute – lazy images are swapped to their real sources when the browser fetches them.
5. **In development builds**, unlazy warns if your LCP element is configured for lazy loading. See the [Core Web Vitals guide](/guide/core-web-vitals).
