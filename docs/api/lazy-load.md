# `lazyLoad`

The `lazyLoad` function takes a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to lazy-load. By default, it processes all images with the `loading="lazy"` attribute

## How It Works

1. Detects whether the visitor is a bot or a crawler. This ensures that the full-quality image is loaded and indexed by search engines.
   - The `data-srcset` attribute will be converted to `srcset`.
   - The `data-src` attribute will be converted to `src`.
2. Processes all images with a `loading="lazy"` attribute.
   - Calculates the image's `sizes` attribute if `data-sizes="auto"` is set.
   - Generates a blurry placeholder from a [BlurHash](/placeholders/blurhash) or [ThumbHash](/placeholders/thumbhash) string if applicable.
3. If the image has a blurry placeholder and is already in the viewport or the visitor is a crawler, it immediately loads the full-quality image.
4. If the image is not yet in the viewport, an event listener is added to load the full-quality image when it enters the viewport.

## Options

Options can be passed to the function to customize its behavior:

- `hash`: Whether to use a hash for generating a blurry placeholder. Can be a boolean or a string. Default is `true`. If `thumbhash` is provided, it takes precedence over `blurhash`.
- `hashType`: The type of hash to use. Possible values are `blurhash` and `thumbhash`. Default is `blurhash`.
- `placeholderSize`: The size of the longer edge for BlurHash decoding. Default is `32`. Ignored for ThumbHash.
- `updateSizesOnResize`: Whether to update the `sizes` attribute on window resize events using a debounced ResizeObserver. Default is `false`.
- `onImageLoad`: A callback function invoked when an image loads successfully.

## Return Value

The function returns a cleanup function that removes all event listeners and ResizeObservers created by `lazyLoad`. Call this function when images are no longer needed to prevent memory leaks:

```ts
const cleanup = lazyLoad()

// Later, when cleaning up
cleanup()
```

## Type Declarations

```ts
interface UnLazyLoadOptions {
  /**
   * Whether to generate a blurry placeholder from a [BlurHash](https://blurha.sh)
   * or [ThumbHash](https://github.com/evanw/thumbhash) string. The placeholder
   * image will be inlined as a data URI in the `src` attribute.
   *
   * @remarks
   * If this option is set to `true`, the `data-blurhash` or `data-thumbhash`
   * attributes will be used for the hash string. If you pass a single element
   * as the `selectorsOrElements` argument, you can also pass a string to this
   * option to override the hash string.
   */
  hash?: string | boolean

  /**
   * Specify the hash type to use for generating the blurry placeholder.
   *
   * @remarks
   * This option is ignored if the `hash` option is set to a boolean value.
   * In these cases, the `data-blurhash` or `data-thumbhash` attributes will
   * be used to determine the hash type.
   *
   * @default 'blurhash'
   */
  hashType?: 'blurhash' | 'thumbhash'

  /**
   * The size of the longer edge (width or height) of the BlurHash image to be
   * decoded, depending on the aspect ratio.
   *
   * @remarks
   * This option is ignored if the `hashType` option is set to `thumbhash`.
   *
   * @default 32
   */
  placeholderSize?: number

  /**
   * Whether to update the `sizes` attribute on resize events with the current image width.
   *
   * @default false
   */
  updateSizesOnResize?: boolean

  /**
   * A callback function to run when an image is loaded.
   */
  onImageLoad?: (image: HTMLImageElement) => void
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
