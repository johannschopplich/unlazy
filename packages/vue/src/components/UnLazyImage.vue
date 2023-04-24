<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { lazyLoad } from 'unlazy'

const props = defineProps<{
  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  autoSizes?: boolean
  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string
  /** A ThumbHash string representing the blurry placeholder image. */
  thumbhash?: string
  /** The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. */
  placeholderSize?: number
  /**
   * A flag to indicate whether the image should be loaded immediately.
   * @default false
   */
  immediate?: boolean
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
      immediate: props.immediate,
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
    :data-sizes="autoSizes ? 'auto' : undefined"
    loading="lazy"
  >
</template>
