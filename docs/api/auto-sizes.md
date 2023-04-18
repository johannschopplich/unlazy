# `autoSizes`

Automatically calculate the `sizes` attribute if the `data-sizes` attribute is set to `auto`.

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
