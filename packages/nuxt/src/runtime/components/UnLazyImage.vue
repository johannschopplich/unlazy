<script setup lang="ts">
import { lazyLoad } from 'unlazy'
import { createPngDataUri as createPngDataUriFromThumbHash } from 'unlazy/thumbhash'
import { createPngDataUri as createPngDataUriFromBlurHash } from 'unlazy/blurhash'
import type { ImgHTMLAttributes } from 'vue'
import { onBeforeUnmount, onMounted, ref, useRuntimeConfig, watchEffect } from '#imports'

const props = withDefaults(
  defineProps<{
    src?: ImgHTMLAttributes['src']
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
    /** Aspect ratio (width / height) of the decoded BlurHash image. Only applies to SSR-decoded placeholder images from a BlurHash string. */
    placeholderRatio?: number
    /**
     * A flag to indicate whether the image should be lazy-loaded (default) or deferred until this prop is set to `true`. Note: Placeholder images from hashes will still be decoded.
     * @default true
     */
    lazyLoad?: boolean
    /** Whether the ThumbHash or BlurHash should be decoded on the server. Overrides the global module configuration if set. */
    ssr?: boolean
  }>(),
  {
    src: undefined,
    autoSizes: false,
    blurhash: undefined,
    thumbhash: undefined,
    placeholderSize: undefined,
    placeholderRatio: undefined,
    lazyLoad: true,
    ssr: undefined,
  },
)

const { unlazy } = useRuntimeConfig().public
const target = ref<HTMLImageElement | undefined>()
let cleanup: () => void | undefined
// const now = performance.now()

// SSR-decoded BlurHash as PNG data URI placeholder image
const loadSSR = process.server && (props.ssr ?? unlazy.ssr)
const pngPlaceholder = (loadSSR && (props.thumbhash || props.blurhash))
  ? props.blurhash
    ? createPngDataUriFromBlurHash(props.blurhash, {
      size: props.placeholderSize || unlazy.placeholderSize,
      ratio: props.placeholderRatio,
    })
    : createPngDataUriFromThumbHash(props.thumbhash!)
  : undefined

// if (loadSSR && process.dev)
//   console.log(`[unlazy] BlurHash decoded in ${performance.now() - now}ms`)

onMounted(() => {
  if (!target.value)
    return

  watchEffect(() => {
    cleanup?.()

    if (!props.lazyLoad)
      return

    cleanup = lazyLoad(target.value, {
      hash: props.thumbhash || props.blurhash,
      hashType: props.thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize: props.placeholderSize || unlazy.placeholderSize,
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
