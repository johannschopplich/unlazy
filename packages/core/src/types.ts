export interface UnLazyLoadOptions {
  /**
   * Whether to generate a blurry placeholder from a [BlurHash](https://blurha.sh/) string.
   * The placeholder image will be inlined as a `data:` URI in the `src` attribute.
   *
   * @remarks
   * If the `blurhash` attribute is set to `true`, the `data-blurhash` attribute will be used.
   * For single elements you can also pass a string directly.
   */
  blurhash?: string | boolean

  /**
   * The size of the longer edge (width or height) of the decoded BlurHash image, depending on the aspect ratio.
   * This value will be used to calculate the dimensions of the generated blurry placeholder from a BlurHash string.
   *
   * @default 32
   */
  blurhashSize?: number

  /**
   * A callback function to run when an image is loaded.
   */
  onLoaded?: (image: HTMLImageElement) => void
}
