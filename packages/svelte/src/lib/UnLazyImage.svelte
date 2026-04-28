<script lang='ts'>
  import type { HTMLImgAttributes } from 'svelte/elements'
  import type { UnLazySource } from 'unlazy'
  import { autoSizes as _autoSizes, lazyLoad, triggerLoad } from 'unlazy'

  const {
    src,
    srcSet,
    sources,
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
    /** Image source URLs for different resolutions. This will render the `<picture>` element instead of `<img>`. */
    sources?: UnLazySource[]
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
      const cleanupSizes = autoSizes
        ? _autoSizes(target, { updateOnResize: true })
        : undefined
      const cleanupLoad = triggerLoad(target, { onImageLoad, onImageError })
      return () => {
        cleanupSizes?.()
        cleanupLoad()
      }
    }

    const cleanup = lazyLoad(target, {
      hash: thumbhash || blurhash,
      hashType: thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize,
      updateSizesOnResize: autoSizes,
      onImageLoad,
      onImageError,
    })
    return () => {
      cleanup()
    }
  })
</script>

{#if sources?.length}
  <picture>
    {#each sources as source, index (index)}
      <source
        type={source.type}
        media={source.media}
        width={source.width}
        height={source.height}
        data-srcset={source.srcSet}
        data-sizes={source.sizes || (autoSizes ? 'auto' : undefined)}
      />
    {/each}
    <img
      bind:this={target}
      src={placeholderSrc}
      data-src={src}
      data-srcset={srcSet}
      data-sizes={autoSizes ? 'auto' : undefined}
      {loading}
      {...restProps}
    />
  </picture>
{:else}
  <img
    bind:this={target}
    src={placeholderSrc}
    data-src={src}
    data-srcset={srcSet}
    data-sizes={autoSizes ? 'auto' : undefined}
    {loading}
    {...restProps}
  />
{/if}
