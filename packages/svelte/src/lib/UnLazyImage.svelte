<script lang='ts'>
  import type { HTMLImgAttributes } from 'svelte/elements'
  import type { TriggerLoadOptions, UnLazyImageProps } from 'unlazy'
  import { lazyLoad, resolveImageAttributes } from 'unlazy'

  const {
    src,
    srcSet,
    sources,
    autoSizes,
    blurhash,
    thumbhash,
    placeholderSrc,
    placeholderSize,
    preload,
    loading,
    onImageLoad,
    onImageError,
    ...restProps
  }: Omit<UnLazyImageProps, 'src' | 'srcSet' | 'loading'>
    // Svelte's `<img>` attributes accept `null` for these.
    & {
      src?: HTMLImgAttributes['src']
      srcSet?: HTMLImgAttributes['srcset']
      loading?: HTMLImgAttributes['loading']
    }
    & TriggerLoadOptions
    & Omit<HTMLImgAttributes, 'srcset' | keyof UnLazyImageProps> = $props()

  let target = $state<HTMLImageElement | undefined>()
  // Read the callbacks on call, so a new one does not reload the image.
  const outcomeCallbacks = {
    onImageLoad: (image: HTMLImageElement) => onImageLoad?.(image),
    onImageError: (image: HTMLImageElement, error: Event) => onImageError?.(image, error),
  }
  const attributes = $derived(resolveImageAttributes({
    src: src ?? undefined,
    srcSet: srcSet ?? undefined,
    sources,
    autoSizes,
    blurhash,
    thumbhash,
    placeholderSrc,
    preload,
    loading: loading ?? undefined,
  }))
  // The effect reads single fields, since `attributes` changes with every new
  // `sources` array.
  const hasRealSources = $derived(attributes.hasRealSources)
  const sourcesKey = $derived(attributes.sourcesKey)
  const hash = $derived(attributes.hash)
  const hashType = $derived(attributes.hashType)

  $effect(() => {
    if (!target)
      return

    // Track changes to image sources to trigger reactivity.
    void hasRealSources
    void src
    void srcSet
    void sourcesKey

    return lazyLoad(target, {
      hash,
      hashType,
      placeholderSize,
      updateSizesOnResize: autoSizes,
      preload,
      ...outcomeCallbacks,
    })
  })
</script>

{#snippet image()}
  <img
    bind:this={target}
    {...attributes.image}
    {...restProps}
  />
{/snippet}

{#if sources?.length}
  <picture>
    {#each attributes.sources as sourceAttributes, index (index)}
      <source {...sourceAttributes} />
    {/each}
    {@render image()}
  </picture>
{:else}
  {@render image()}
{/if}
