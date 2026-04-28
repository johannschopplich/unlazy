// #region UnLazyLoadOptions
export interface UnLazyLoadOptions {
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
   * Whether `data-sizes="auto"` should retrack the rendered image width on
   * viewport resize. Applies to both `<img>` elements and their `<source>`
   * siblings inside a `<picture>`. Internally delegates to `autoSizes`.
   *
   * @default false
   */
  updateSizesOnResize?: boolean

  /**
   * A callback function to run when an image is loaded.
   */
  onImageLoad?: (image: HTMLImageElement) => void

  /**
   * A callback function to run when an image fails to load.
   */
  onImageError?: (image: HTMLImageElement, error: Event) => void
}
// #endregion UnLazyLoadOptions

// #region TriggerLoadOptions
export interface TriggerLoadOptions {
  /**
   * A callback function to run when the image finishes loading.
   */
  onImageLoad?: (image: HTMLImageElement) => void

  /**
   * A callback function to run when the image fails to load. A synthetic
   * `error` event is also dispatched on the visible `<img>` before this fires.
   */
  onImageError?: (image: HTMLImageElement, error: Event) => void
}
// #endregion TriggerLoadOptions

// #region AutoSizesOptions
export interface AutoSizesOptions {
  /**
   * Whether `data-sizes="auto"` should retrack the rendered width on viewport
   * resize. Sets up a debounced `ResizeObserver` per call; the returned
   * disposer disconnects it.
   *
   * @default false
   */
  updateOnResize?: boolean
}
// #endregion AutoSizesOptions

// #region UnLazySource
export interface UnLazySource {
  /** Image source set for the `<source>` element. Will be applied lazily via `data-srcset`. */
  srcSet: string

  /**
   * Media query that selects this source, e.g. `(max-width: 600px)`. Use this for art
   * direction across breakpoints.
   */
  media?: string

  /** MIME type for format negotiation, e.g. `image/avif` or `image/webp`. */
  type?: string

  /**
   * Explicit `sizes` value. When unset and the parent has automatic sizing enabled, the
   * source falls back to `sizes="auto"` (resolved to a numeric pixel width).
   */
  sizes?: string

  /**
   * Intrinsic width in pixels. When the matching `<source>` is selected, the browser uses
   * this together with `height` to set the rendered `<img>`'s aspect ratio. Prevents
   * layout shift when the breakpoint changes.
   */
  width?: number

  /** Intrinsic height in pixels. Pairs with `width` to prevent layout shift across breakpoints. */
  height?: number
}
// #endregion UnLazySource
