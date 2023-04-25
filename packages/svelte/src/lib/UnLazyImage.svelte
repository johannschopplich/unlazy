<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import { lazyLoad } from 'unlazy'
  import type { UnLazyLoadOptions } from 'unlazy'

  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  export let autoSizes = false
  /** A BlurHash string representing the blurry placeholder image. */
  export let blurhash: string | undefined = undefined
  /** A ThumbHash string representing the blurry placeholder image. */
  export let thumbhash: string | undefined = undefined
  export let placeholderSize: UnLazyLoadOptions['placeholderSize'] = 32

  let target: HTMLImageElement | undefined
  let cleanup: (() => void) | undefined
  let isMounted = false

  onMount(() => {
    isMounted = true
  })

  $: if (isMounted && target) {
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

<!-- svelte-ignore a11y-missing-attribute -->
<img
  bind:this={target}
  data-sizes={autoSizes ? 'auto' : undefined}
  loading="lazy"
  {...$$restProps}
/>
