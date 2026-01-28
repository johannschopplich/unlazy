# `loadImage`

The `loadImage` function programmatically loads an image by updating its attributes from data attributes. It handles both standalone `<img>` elements and images within `<picture>` elements.

The function performs the following operations:

1. If the image is inside a `<picture>` element, updates all `<source>` elements by converting their `data-srcset` and `data-sizes` attributes to standard attributes.
2. Preloads the image in a temporary element to ensure proper loading.
3. Calculates the `sizes` attribute if `data-sizes="auto"` is set.
4. Swaps `data-src` and `data-srcset` to their standard counterparts.
5. Invokes the optional callback when loading completes.

## Type Declarations

<<< @/../packages/core/src/lazyLoad.ts#loadImage{ts}
