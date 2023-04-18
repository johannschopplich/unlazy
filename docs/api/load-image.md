# `loadImage`

Pass an instance of `HTMLImageElement` representing the image you want to load manually to the `loadImage` function. The function will load the image and set the `srcset` attributes accordingly.

## Type Declarations

```ts
function loadImage(
  image: HTMLImageElement,
  onLoaded?: (image: HTMLImageElement) => void
): void
```
