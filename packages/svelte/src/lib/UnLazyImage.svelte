<script lang='ts'>
  import type { HTMLImgAttributes } from 'svelte/elements'
  import { autoSizes as _autoSizes, lazyLoad, triggerLoad } from 'unlazy'

  const {
    src,
    srcSet,
    autoSizes = false,
    blurhash,
    thumbhash,
    placeholderSrc,
    placeholderSize,
    preload = false,
    loading = 'lazy',
    onImageLoad,
    onImageError,
    ...restProps
  }: {
    /** Image source URL to be lazy-loaded. */
    src?: HTMLImgAttributes['src']
    /** Image source set to be lazy-loaded. */
    srcSet?: HTMLImgAttributes['srcset']
    /**
     * A flag to indicate whether the sizes attribute should be automatically calculated.
     * @default false
     */
    autoSizes?: boolean
    /** A BlurHash string representing the blurry placeholder image. */
    blurhash?: string
    /** A ThumbHash string representing the blurry placeholder image. */
    thumbhash?: string
    /** Optional image source URL for a custom placeholder image. Will be ignored if a BlurHash or ThumbHash is provided. */
    placeholderSrc?: string
    /** The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. */
    placeholderSize?: number
    /**
     * A flag to indicate whether the image should be preloaded, even if it is not in the viewport yet.
     * @default false
     */
    preload?: boolean
    /**
     * Allows to specify the loading strategy of the image.
     * @default 'lazy'
     */
    loading?: HTMLImgAttributes['loading']
    /** A callback function to run when the image is loaded. */
    onImageLoad?: (image: HTMLImageElement) => void
    /** A callback function to run when the image fails to load. */
    onImageError?: (image: HTMLImageElement, error: Event) => void
  } & Omit<HTMLImgAttributes, 'srcset'> = $props()

  let target = $state<HTMLImageElement | undefined>()

  $effect(() => {
    if (!target)
      return

    if (preload) {
      if (autoSizes)
        _autoSizes(target)
      triggerLoad(target, onImageLoad, onImageError)
      return
    }

    const cleanup = lazyLoad(target, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
      onImageLoad,
      onImageError,
    })

    return () => {
      cleanup()
    }
  })
</script>

<img
  bind:this={target}
  src={placeholderSrc}
  data-src={src}
  data-srcset={srcSet}
  data-sizes={autoSizes ? 'auto' : undefined}
  {loading}
  {...restProps}
/>
