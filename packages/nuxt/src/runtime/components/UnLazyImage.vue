<script setup lang="ts">
import { lazyLoad } from 'unlazy'
import { createPngDataUri } from 'unlazy/blurhash'
import type { ImgHTMLAttributes } from 'vue'
import { onBeforeUnmount, onMounted, ref, useRuntimeConfig } from '#imports'

const props = withDefaults(
  defineProps<{
    src?: ImgHTMLAttributes['src']
    autoSizes?: boolean
    blurhash?: string
    blurhashSize?: number
    /** Only applies to SSR-decoded placeholder images from BlurHash */
    blurhashRatio?: number
    /** Whether the BlurHash should be decoded on the server. Overrides the global module config if set. */
    ssr?: boolean
  }>(),
  {
    src: undefined,
    autoSizes: false,
    blurhash: undefined,
    blurhashSize: undefined,
    blurhashRatio: undefined,
    ssr: undefined,
  },
)

const { unlazy } = useRuntimeConfig().public
const target = ref<HTMLImageElement | undefined>()

// SSR-Generate a PNG data URI from the BlurHash
const isSSR = props.ssr ?? unlazy.blurhash?.ssr
const pngPlaceholder = (process.server && props.blurhash && isSSR)
  ? createPngDataUri(props.blurhash, { ratio: props.blurhashRatio })
  : undefined

onMounted(() => {
  if (target.value) {
    const cleanup = lazyLoad(target.value, {
      blurhash: props.blurhash,
      blurhashSize: props.blurhashSize || unlazy.blurhash?.size,
    })
    onBeforeUnmount(cleanup)
  }
})
</script>

<template>
  <img
    ref="target"
    :src="pngPlaceholder || src"
    :data-sizes="autoSizes ? 'auto' : undefined"
    loading="lazy"
  >
</template>
