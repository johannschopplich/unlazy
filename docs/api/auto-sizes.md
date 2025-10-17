# `autoSizes`

The `autoSizes` function calculates and sets the `sizes` attribute based on the current display width of image or source elements when `data-sizes="auto"` is present.

The calculation uses the element's rendered width (`element.offsetWidth`) to determine the appropriate value for the `sizes` attribute, enabling browsers to select the optimal image from a `srcset`.

To lazy load images, refer to the [`lazyLoad`](/api/lazy-load) method.

## Type Declarations

```ts
function autoSizes<T extends HTMLImageElement | HTMLSourceElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to calculate the `sizes` attribute for.
   *
   * @default 'img[data-sizes="auto"], source[data-sizes="auto"]'
   */
  selectorsOrElements?: string | T | NodeListOf<T> | T[]
): void
```

## Example

```html
<img
  srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  data-sizes="auto"
>
```
