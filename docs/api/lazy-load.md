# `lazyLoad`

The `lazyLoad` function takes a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load. By default, it processes all images with the `loading="lazy"` attribute.

## How It Works

1. Detects whether the visitor is a bot or a crawler. This ensures that the full-quality image is loaded and indexed by search engines.
   - The `data-srcset` attribute will be converted to `srcset`.
   - The `data-src` attribute will be converted to `src`.
2. Processes all images with a `loading="lazy"` attribute.
   - Calculates the image's `sizes` attribute if `data-sizes="auto"` is set.
   - Generates a blurry placeholder from a [hash-based placeholder](/guide/placeholders) (BlurHash or ThumbHash) string if applicable.
3. If the image has a blurry placeholder and is already in the viewport or the visitor is a crawler, it immediately loads the full-quality image.
4. If the image is not yet in the viewport, an event listener is added to load the full-quality image when it enters the viewport.

## Options

Options can be passed to the function to customize its behavior:

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `hash` | `boolean \| string` | `true` | Whether to use a hash for generating a blurry placeholder. Can be `true` (auto-detect from `data-blurhash`/`data-thumbhash`), `false` (disabled), or a hash string. |
| `hashType` | `'blurhash' \| 'thumbhash'` | `'blurhash'` | The type of hash to use. Ignored when `hash` is boolean (auto-detected from data attributes). |
| `placeholderSize` | `number` | `32` | The size of the longer edge for BlurHash decoding. Ignored for ThumbHash. |
| `updateSizesOnResize` | `boolean` | `false` | Whether to update the `sizes` attribute on resize events using a debounced ResizeObserver. Useful for responsive layouts where image display size changes. |
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
