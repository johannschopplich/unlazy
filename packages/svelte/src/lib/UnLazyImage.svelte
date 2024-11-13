<script lang='ts'>
  import type { HTMLImgAttributes } from 'svelte/elements'
  import { lazyLoad } from 'unlazy'

  const {
    src,
    srcSet,
    autoSizes = false,
    blurhash,
    thumbhash,
    placeholderSrc,
    placeholderSize,
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
  } & Omit<HTMLImgAttributes, 'srcset'> = $props()

  let target = $state<HTMLImageElement | undefined>()

  $effect(() => {
    if (!target)
      return

    const cleanup = lazyLoad(target, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
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
  loading='lazy'
  {...restProps}
/>
