<script lang="ts">
  import { onMount } from 'svelte'
  import { lazyLoad } from 'unlazy'

  /** A flag to indicate whether the sizes attribute should be automatically calculated. */
  export let autoSizes:boolean = false;
  /** A BlurHash string representing the blurry placeholder image. */
  export let blurhash:string|undefined = undefined;
  /** A ThumbHash string representing the blurry placeholder image. */
  export let thumbhash:string|undefined = undefined;
  /** The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. */
  export let placeholderSize:number = 600;

  let target:HTMLImageElement

  function initLazyLoad() {
    if(!!target) {
      lazyLoad(target, {
        hash: thumbhash ? thumbhash : blurhash,
        hashType: thumbhash ? 'thumbhash' : 'blurhash',
        placeholderSize: placeholderSize,
      })
    }
  }

  $: [blurhash, thumbhash, placeholderSize], initLazyLoad();

  onMount(initLazyLoad);
</script>

<img
  bind:this={target}
  data-sizes="{autoSizes ? 'auto' : null}"
  loading="lazy"
  {...$$restProps}
/>
