// #region UnLazyLoadOptions
export interface UnLazyLoadOptions extends TriggerLoadOptions {
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
   * decoded, depending on the aspect ratio. Values above 100 are capped at 100.
   *
   * @remarks
   * This option is ignored if the `hashType` option is set to `thumbhash`.
   *
   * @default 32
   */
  placeholderSize?: number

  /**
   * Whether `data-sizes="auto"` should be resolved again when the rendered
   * width of the image changes. Applies to both `<img>` elements and their
   * `<source>` siblings inside a `<picture>`. Internally delegates to `autoSizes`.
   *
   * @default false
   */
  updateSizesOnResize?: boolean

  /**
   * Whether to load the image right away instead of when it nears the
   * viewport. The hash placeholder is decoded first and stays until the image
   * has loaded. Internally delegates to `triggerLoad`.
   *
   * @default false
   */
  preload?: boolean

  /**
   * Whether to hold the image on its hash placeholder and load nothing, even
   * with `preload` set. A later call without `hold` loads it. An image that has
   * loaded, or that has its own `src` or `srcset` and no `data-src` or
   * `data-srcset`, keeps its sources. A held image reports no outcome.
   *
   * @default false
   */
  hold?: boolean
}
// #endregion UnLazyLoadOptions

// #region TriggerLoadOptions
export interface TriggerLoadOptions {
  /** Runs once the visible `<img>` has loaded the swapped-in source. */
  onImageLoad?: (image: HTMLImageElement) => void

  /**
   * Runs when the image fails to load. The visible `<img>` receives an `error`
   * event first, even when only the preload failed.
   */
  onImageError?: (image: HTMLImageElement, error: Event) => void
}
// #endregion TriggerLoadOptions

// #region CreatePlaceholderFromHashOptions
export interface CreatePlaceholderFromHashOptions {
  /**
   * Image to read the hash from its `data-thumbhash` or `data-blurhash`
   * attribute, and the ratio from its width and height.
   */
  image?: HTMLImageElement
  hash?: string
  hashType?: 'blurhash' | 'thumbhash'
  /**
   * Longer edge of a BlurHash placeholder in pixels. Values above 100 are
   * capped at 100.
   *
   * @default 32
   */
  size?: number
  /**
   * Aspect ratio (width / height) of a BlurHash placeholder. Read from `image`
   * when both its width and height are known, otherwise square.
   */
  ratio?: number
}
// #endregion CreatePlaceholderFromHashOptions

// #region AutoSizesOptions
export interface AutoSizesOptions {
  /**
   * Whether `data-sizes="auto"` should be resolved again when the rendered
   * width changes. Sets up a debounced `ResizeObserver` per call; the returned
   * cleanup function disconnects it.
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

export interface UnLazyImageProps {
  /** Image source URL to be lazy-loaded. */
  src?: string

  /** Image source set to be lazy-loaded. */
  srcSet?: string

  /** Sources of the `<picture>` rendered around the `<img>`. */
  sources?: UnLazySource[]

  /**
   * Whether the `sizes` attribute should be automatically calculated.
   *
   * @default false
   */
  autoSizes?: boolean

  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string

  /** A ThumbHash string representing the blurry placeholder image, which takes precedence over `blurhash`. */
  thumbhash?: string

  /** Custom placeholder image URL, ignored if a BlurHash or ThumbHash is provided. */
  placeholderSrc?: string

  /**
   * Longer edge of the decoded BlurHash image, capped at `100`. Ignored for a ThumbHash.
   *
   * @default 32
   */
  placeholderSize?: number

  /**
   * Whether the image should be preloaded, even if it is not in the viewport yet.
   *
   * @default false
   */
  preload?: boolean

  /**
   * Loading strategy of the image. `'eager'` without `autoSizes` renders the
   * real sources.
   *
   * @default 'lazy'
   */
  loading?: 'eager' | 'lazy'

  /**
   * Whether the image may load. `false` holds it on its placeholder until this
   * turns `true` and defaults `loading` to `'eager'`, unless `preload` is set.
   *
   * @default true
   */
  lazyLoad?: boolean
}

export interface UnLazyImageAttributes {
  /** Attributes of the `<img>`, under their HTML names. */
  image: {
    'src'?: string
    'srcset'?: string
    'data-src'?: string
    'data-srcset'?: string
    'data-sizes'?: string
    'loading': 'eager' | 'lazy'
  }

  /** Attributes of each `<source>`, under their HTML names and in the order of `sources`. */
  sources: {
    'type'?: string
    'media'?: string
    'width'?: number
    'height'?: number
    'srcset'?: string
    'sizes'?: string
    'data-srcset'?: string
    'data-sizes'?: string
  }[]

  lazyLoadOptions: Omit<UnLazyLoadOptions, keyof TriggerLoadOptions | 'hash'> & { hash?: string }

  /**
   * Content of the attributes and of `lazyLoadOptions`, for an effect to
   * compare, since an inline `sources` array is a new array on every render.
   */
  loadKey: string
}
