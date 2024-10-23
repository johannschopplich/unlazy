<script lang='ts'>
  import { onDestroy } from 'svelte'
  import { lazyLoad } from 'unlazy'

  /** Image source URL to be lazy-loaded. */
  export let src: string | undefined = undefined
  /** Image source set to be lazy-loaded. */
  export let srcSet: string | undefined = undefined
  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  export let autoSizes = false
  /** A BlurHash string representing the blurry placeholder image. */
  export let blurhash: string | undefined = undefined
  /** A ThumbHash string representing the blurry placeholder image. */
  export let thumbhash: string | undefined = undefined
  /** Optional image source URL for a custom placeholder image. Will be ignored if a BlurHash or ThumbHash is provided. */
  export let placeholderSrc: string | undefined = undefined
  /** The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. */
  export let placeholderSize: number | undefined = undefined

  let target: HTMLImageElement | undefined = undefined
  let cleanup: (() => void) | undefined = undefined

  $: if (target) {
    cleanup?.()

    cleanup = lazyLoad(target, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
    })
  }

  onDestroy(() => {
    cleanup?.()
  })
</script>

<img
  bind:this={target}
  src={placeholderSrc}
  data-src={src}
  data-srcset={srcSet}
  data-sizes={autoSizes ? 'auto' : undefined}
  loading='lazy'
  {...$$restProps}
/>
