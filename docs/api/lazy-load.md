# `lazyLoad`

The main method of the library. It works as follows:

1. Detects whether the visitor is a bot or a crawler. This ensures that the full-quality image is loaded and indexed by search engines. The `data-srcset` attribute will be converted to `srcset`.
2. Processes all images with a `loading="lazy"` attribute: it calculates the image's `sizes` attribute if `data-sizes="auto"` is set and then checks if the image has a blurry placeholder (given the `data-srcset` attribute).
3. If the image has a blurry placeholder and is already in the viewport or the visitor is a crawler, it immediately loads the full-quality image.
4. If the image is not yet in the viewport, an event listener is added to load the full-quality image when it enters the viewport.

## Type Declarations

```ts
interface UnLazyLoadOptions {
  /**
   * Whether to generate a blurry placeholder from a [Blurhash](https://blurha.sh/) string.
   * The placeholder image will be inlined as a `data:` URI in the `src` attribute.
   *
   * @remarks
   * If the `blurhash` attribute is set to `true`, the `data-blurhash` attribute will be used.
   * For single elements you can also pass a string directly.
   */
  blurhash?: string | boolean
  /**
   * The size of the longer edge (width or height) of the decoded BlurHash image, depending on the aspect ratio.
   * This value will be used to calculate the dimensions of the generated blurry placeholder from a Blurhash string.   *
   * @default 32
   */
  blurhashSize?: number
  /**
   * A callback function to run when an image is loaded.
   */
  onLoaded?: (image: HTMLImageElement) => void
}

function lazyLoad<T extends HTMLImageElement>(
  /**
   * A CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load.
   *
   * @default 'img[loading="lazy"]'
   */
  selectorsOrElements?: string | T | NodeListOf<T> | T[],

  options?: UnLazyLoadOptions
): () => void
```
