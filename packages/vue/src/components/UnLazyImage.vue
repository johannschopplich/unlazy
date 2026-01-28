<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'
import { autoSizes as _autoSizes, lazyLoad, triggerLoad } from 'unlazy'
import { onBeforeUnmount, ref, watchEffect } from 'vue'

const props = defineProps<{
  /** Image source URL to be lazy-loaded. */
  src?: ImgHTMLAttributes['src']
  /** Image source set to be lazy-loaded. */
  srcSet?: ImgHTMLAttributes['srcset']
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
  (event: 'loaded', image: HTMLImageElement): void
  (event: 'error', error: Event): void
}>()

const target = ref<HTMLImageElement | undefined>()
let cleanup: (() => void) | undefined

watchEffect(() => {
  cleanup?.()

  if (!target.value)
    return

  if (props.preload) {
    if (props.autoSizes)
      _autoSizes(target.value)
    triggerLoad(target.value, image => emit('loaded', image))
    return
  }

  cleanup = lazyLoad(target.value, {
    hash: props.thumbhash || props.blurhash,
    hashType: props.thumbhash ? 'thumbhash' : 'blurhash',
    placeholderSize: props.placeholderSize,
    onImageLoad: image => emit('loaded', image),
  })
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <img
    ref="target"
    :src="placeholderSrc"
    :data-src="src"
    :data-srcset="srcSet"
    :data-sizes="autoSizes ? 'auto' : undefined"
    :loading="loading || 'lazy'"
    @error="emit('error', $event)"
  >
</template>
