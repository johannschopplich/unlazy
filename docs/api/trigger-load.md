# `triggerLoad`

The `triggerLoad` function programmatically loads an image by updating its attributes from data attributes. It handles both standalone `<img>` elements and images within `<picture>` elements.

The function performs the following operations:

1. If the image is inside a `<picture>` element, updates all `<source>` elements by converting their `data-srcset` and `data-sizes` attributes to standard attributes synchronously. Callbacks fire after the browser resolves a source on the visible `<img>`.
2. For standalone `<img>` elements, preloads the image in a temporary element to ensure proper loading.
3. Calculates the `sizes` attribute if `data-sizes="auto"` is set.
4. Swaps `data-src` and `data-srcset` to their standard counterparts.
5. Invokes the optional `onImageLoad` callback when loading completes, or `onImageError` if loading fails. On failure, a synthetic `error` event also fires on the visible `<img>`.

`triggerLoad` returns a disposer that detaches its listeners and, for standalone images, aborts the in-flight network fetch. Calling it after the load has already completed is a no-op.

## Type Declarations

<<< @/../packages/core/src/lazyLoad.ts#triggerLoad{ts}

## Example

```ts
import { triggerLoad } from 'unlazy'

const image = document.querySelector<HTMLImageElement>('.priority-image')!

// Load immediately with callbacks
const dispose = triggerLoad(image, {
  onImageLoad: img => console.log('Loaded:', img.src),
  onImageError: (img, error) => console.error('Failed to load:', img, error),
})

// Later, cancel the load if it hasn't completed yet
dispose()
```
