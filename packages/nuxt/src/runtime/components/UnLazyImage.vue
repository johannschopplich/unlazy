<script setup lang="ts">
import { lazyLoad } from 'unlazy'
import { createPngDataUri } from 'unlazy/blurhash'
import type { ImgHTMLAttributes } from 'vue'
import { onBeforeUnmount, onMounted, ref, useRuntimeConfig, watchEffect } from '#imports'

const props = withDefaults(
  defineProps<{
    src?: ImgHTMLAttributes['src']
    autoSizes?: boolean
    blurhash?: string
    blurhashSize?: number
    /** Only applies to SSR-decoded placeholder images from BlurHash. */
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
let cleanup: () => void

// SSR-decoded BlurHash as PNG data URI placeholder image
const isSSR = props.ssr ?? unlazy.blurhash?.ssr
// const now = performance.now()
const pngPlaceholder = (process.server && props.blurhash && isSSR)
  ? createPngDataUri(props.blurhash, { ratio: props.blurhashRatio })
  : undefined

// if (isSSR)
//   console.log(`[unlazy] BlurHash decoded in ${performance.now() - now}ms`)

onMounted(() => {
  watchEffect(() => {
    cleanup?.()

    if (!target.value)
      return

    cleanup = lazyLoad(target.value, {
      blurhash: props.blurhash,
      blurhashSize: props.blurhashSize || unlazy.blurhash?.size,
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
    :src="pngPlaceholder || src"
    :data-sizes="autoSizes ? 'auto' : undefined"
    loading="lazy"
  >
</template>
