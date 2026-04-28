# `lazyLoad`

The `lazyLoad` function takes a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.

By default it matches:

```
img[loading="lazy"], img[loading="eager"][data-src], img[loading="eager"][data-srcset]
```

This means both lazy images and above-the-fold images (marked `loading="eager"`) are processed – the eager ones just skip the viewport wait.

## How It Works

1. **Eager images get the priority path.** For `loading="eager"` images with a `data-src` or `data-srcset`:
   - `data-src` / `data-srcset` swap into `src` / `srcset` immediately.
   - `fetchpriority="high"` is set if no value is already present.
   - A hash placeholder is still generated when `data-blurhash` or `data-thumbhash` is present, giving you an instant placeholder while the real image fetches.
2. **Crawlers** get the same immediate-swap treatment so search engines and social-preview scrapers see the real image.
3. **Lazy images** get a blurry placeholder from [hash-based placeholders](/guide/placeholders) (BlurHash / ThumbHash) if applicable, and `data-sizes="auto"` is expanded to a real `sizes` value.
4. **Viewport timing is handled by the browser** via the native `loading="lazy"` attribute – lazy images are swapped to their real sources when the browser fetches them.
5. **During development**, unlazy warns if your LCP element is configured for lazy loading. See the [Core Web Vitals guide](/guide/core-web-vitals).

## Options

Options can be passed to the function to customize its behavior:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `hash` | `boolean \| string` | `true` | Whether to use a hash for generating a blurry placeholder. Can be `true` (auto-detect from `data-blurhash`/`data-thumbhash`), `false` (disabled), or a hash string. |
| `hashType` | `'blurhash' \| 'thumbhash'` | `'blurhash'` | The type of hash to use. Ignored when `hash` is boolean (auto-detected from data attributes). |
| `placeholderSize` | `number` | `32` | The size of the longer edge for BlurHash decoding. Ignored for ThumbHash. |
| `updateSizesOnResize` | `boolean` | `false` | Re-resolve `data-sizes="auto"` on viewport resize – applies to both `<img>` and `<source>` siblings inside a `<picture>`. Internally delegates to [`autoSizes`](/api/auto-sizes); the returned cleanup function disconnects every observer. |
| `onImageLoad` | `(image: HTMLImageElement) => void` | - | Callback invoked when an image loads successfully. |
| `onImageError` | `(image: HTMLImageElement, error: Event) => void` | - | Callback invoked when an image fails to load. |

## Return Value

The function returns a cleanup function that removes all event listeners and ResizeObservers created by `lazyLoad`. Call this function when images are no longer needed to prevent memory leaks:

```ts
const cleanup = lazyLoad()

// Later, when cleaning up
cleanup()
```

## Type Declarations

<<< @/../packages/core/src/types.ts#UnLazyLoadOptions{ts}

<<< @/../packages/core/src/lazyLoad.ts#lazyLoad{ts}
