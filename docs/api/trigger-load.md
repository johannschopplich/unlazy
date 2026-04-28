# `triggerLoad`

The `triggerLoad` function programmatically loads an image by swapping its data attributes to standard ones. It handles both standalone `<img>` elements and images inside `<picture>` elements.

The function performs the following operations:

1. If the image is inside a `<picture>` element, swaps `data-srcset` to `srcset` on every `<source>` and resolves `data-sizes="auto"` to a numeric pixel width before the swap so the browser sees a final value at source-selection time. Callbacks fire after the browser resolves a source on the visible `<img>`.
2. For standalone `<img>` elements, preloads the image in a temporary element to ensure proper loading.
3. Calculates the `sizes` attribute on the temporary element if `data-sizes="auto"` is set on the visible `<img>`.
4. Swaps `data-src` and `data-srcset` to their standard counterparts.
5. Invokes the optional `onImageLoad` callback when loading completes, or `onImageError` if loading fails. On failure, a synthetic `error` event also fires on the visible `<img>`.

`triggerLoad` returns a cleanup function that detaches its listeners and, for standalone images, aborts the in-flight network fetch. Calling it after the load has already completed is a no-op.

::: tip
`triggerLoad` is one-shot – it does not install any `ResizeObserver`. For ongoing source-size tracking on responsive `<picture>` layouts, pair it with [`autoSizes`](/api/auto-sizes) and `{ updateOnResize: true }`:

```ts
const cleanupSizes = autoSizes(image, { updateOnResize: true })
const cleanupLoad = triggerLoad(image)

// Later
cleanupSizes()
cleanupLoad()
```
:::

## Type Declarations

<<< @/../packages/core/src/lazyLoad.ts#triggerLoad{ts}

## Example

```ts
import { triggerLoad } from 'unlazy'

const image = document.querySelector<HTMLImageElement>('.priority-image')!

// Load immediately with callbacks
const cleanup = triggerLoad(image, {
  onImageLoad: img => console.log('Loaded:', img.src),
  onImageError: (img, error) => console.error('Failed to load:', img, error),
})

// Later, cancel the load if it hasn't completed yet
cleanup()
```
