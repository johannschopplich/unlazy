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
// #endregion UnLazyLoadOptions
