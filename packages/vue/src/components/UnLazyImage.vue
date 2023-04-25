<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { lazyLoad } from 'unlazy'
import type { ImgHTMLAttributes } from 'vue'

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
}>()

const target = ref<HTMLImageElement | undefined>()
let cleanup: () => void | undefined

onMounted(() => {
  watchEffect(() => {
    cleanup?.()

    if (!target.value)
      return

    cleanup = lazyLoad(target.value, {
      hash: props.thumbhash || props.blurhash,
      hashType: props.thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize: props.placeholderSize,
    })
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
    loading="lazy"
  >
</template>
