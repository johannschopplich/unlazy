<script setup lang="ts">
import type { UnLazySource } from 'unlazy'
import type { ImgHTMLAttributes } from 'vue'
import { autoSizes as _autoSizes, lazyLoad, triggerLoad } from 'unlazy'
import { ref, watchEffect } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  /** Image source URL to be lazy-loaded. */
  src?: ImgHTMLAttributes['src']
  /** Image source set to be lazy-loaded. */
  srcSet?: ImgHTMLAttributes['srcset']
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
  loading?: ImgHTMLAttributes['loading']
}>()

const emit = defineEmits<{
  (event: 'imageLoad', image: HTMLImageElement): void
  (event: 'imageError', image: HTMLImageElement, error: Event): void
}>()

const target = ref<HTMLImageElement | undefined>()

watchEffect((onCleanup) => {
  if (!target.value)
    return

  // Track changes to image sources to trigger reactivity
  void props.src
  void props.srcSet
  void props.sources

  if (props.preload) {
    const disposeSizes = props.autoSizes
      ? _autoSizes(target.value, { updateOnResize: true })
      : undefined
    const disposeLoad = triggerLoad(target.value, {
      onImageLoad: image => emit('imageLoad', image),
      onImageError: (image, error) => emit('imageError', image, error),
    })
    onCleanup(() => {
      disposeSizes?.()
      disposeLoad()
    })
    return
  }

  const dispose = lazyLoad(target.value, {
    hash: props.thumbhash || props.blurhash,
    hashType: props.thumbhash ? 'thumbhash' : 'blurhash',
    placeholderSize: props.placeholderSize,
    updateSizesOnResize: props.autoSizes,
    onImageLoad: image => emit('imageLoad', image),
    onImageError: (image, error) => emit('imageError', image, error),
  })
  onCleanup(dispose)
})
</script>

<template>
  <picture v-if="sources?.length">
    <source
      v-for="(source, index) in sources"
      :key="index"
      :type="source.type"
      :media="source.media"
      :width="source.width"
      :height="source.height"
      :data-srcset="source.srcSet"
      :data-sizes="source.sizes || (autoSizes ? 'auto' : undefined)"
    >
    <img
      ref="target"
      v-bind="$attrs"
      :src="placeholderSrc"
      :data-src="src"
      :data-srcset="srcSet"
      :data-sizes="autoSizes ? 'auto' : undefined"
      :loading="loading || 'lazy'"
    >
  </picture>
  <img
    v-else
    ref="target"
    v-bind="$attrs"
    :src="placeholderSrc"
    :data-src="src"
    :data-srcset="srcSet"
    :data-sizes="autoSizes ? 'auto' : undefined"
    :loading="loading || 'lazy'"
  >
</template>
