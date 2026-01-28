# `triggerLoad`

The `triggerLoad` function programmatically loads an image by updating its attributes from data attributes. It handles both standalone `<img>` elements and images within `<picture>` elements.

The function performs the following operations:

1. If the image is inside a `<picture>` element, updates all `<source>` elements by converting their `data-srcset` and `data-sizes` attributes to standard attributes synchronously (callbacks are not invoked for picture elements).
2. For standalone `<img>` elements, preloads the image in a temporary element to ensure proper loading.
3. Calculates the `sizes` attribute if `data-sizes="auto"` is set.
4. Swaps `data-src` and `data-srcset` to their standard counterparts.
5. Invokes the optional `onImageLoad` callback when loading completes, or `onImageError` if loading fails.

::: info
The `loadImage` function is a deprecated alias for `triggerLoad` and will be removed in the next major version.
:::

## Type Declarations

<<< @/../packages/core/src/lazyLoad.ts#triggerLoad{ts}

## Example

```ts
import { triggerLoad } from 'unlazy'

const image = document.querySelector('.priority-image')

// Load immediately with callbacks
triggerLoad(
  image,
  (img) => console.log('Loaded:', img.src),
  (img, error) => console.error('Failed to load:', img)
)
```
