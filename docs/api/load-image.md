# `loadImage`

The `loadImage` function takes an `HTMLImageElement` and an optional callback function to execute when the image is loaded. It updates the `src`, `srcset`, and `sizes` attributes of the image and its parent picture element's sources, if applicable.

## Type Declarations

```ts
function loadImage(
  image: HTMLImageElement,
  onImageLoad?: (image: HTMLImageElement) => void
): void
```
