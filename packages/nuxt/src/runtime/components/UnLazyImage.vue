<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'
import type { ModuleOptions } from '../../module'
import { computed, onBeforeUnmount, ref, useRuntimeConfig, watchEffect } from '#imports'
import { autoSizes as _autoSizes, createPlaceholderFromHash, lazyLoad, loadImage } from 'unlazy'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    /** Image source URL to be lazy-loaded. */
    src?: ImgHTMLAttributes['src']
    /** Image source set to be lazy-loaded. */
    srcSet?: ImgHTMLAttributes['srcset']
    /** Image source URLs for different resolutions. This will render the `<picture>` element instead of `<img>`. */
    sources?: {
      type: string
      srcSet: string
      sizes?: string
    }[]
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
    /** Aspect ratio (width / height) of the decoded BlurHash image. Only applies to SSR-decoded placeholder images from a BlurHash string. */
    placeholderRatio?: number
    /** Transition time */
    transition?: number
    
    /**
     * A flag to indicate whether the image should be lazy-loaded (default) or deferred until this prop is set to `true`. Note: Placeholder images from hashes will still be decoded.
     * @default true
     */
    lazyLoad?: boolean
    /**
     * A flag to indicate whether the image should be preloaded, even if it is not in the viewport yet.
     * @default false
     */
    preload?: boolean
    /** Whether the ThumbHash or BlurHash should be decoded on the server. Overrides the global module configuration if set. */
    ssr?: boolean
  }>(),
  {
    src: undefined,
    srcSet: undefined,
    sources: undefined,
    autoSizes: false,
    blurhash: undefined,
    thumbhash: undefined,
    placeholderSrc: undefined,
    placeholderSize: undefined,
    placeholderRatio: undefined,
    transition: 0,
    lazyLoad: true,
    preload: false,
    ssr: undefined,
  },
)

const emit = defineEmits<{
  (event: 'loaded', image: HTMLImageElement): void
  (event: 'error', error: Event): void
}>()

const unlazy = useRuntimeConfig().public.unlazy as ModuleOptions
const hash = computed(() => props.thumbhash || props.blurhash)

// SSR-decoded BlurHash as PNG data URI placeholder image
const pngPlaceholder = (props.ssr ?? unlazy.ssr) && hash.value
  ? createPlaceholderFromHash({
    hash: hash.value,
    hashType: props.thumbhash ? 'thumbhash' : 'blurhash',
    size: props.placeholderSize || unlazy.placeholderSize,
    ratio: props.placeholderRatio,
  })
  : undefined

const target = ref<HTMLImageElement | undefined>()
let cleanup: (() => void) | undefined
let lastHash: string | undefined

watchEffect(() => {
  cleanup?.()

  if (!target.value)
    return

  if (hash.value && hash.value !== lastHash) {
    const placeholder = createPlaceholderFromHash({
      image: target.value,
      hash: hash.value,
      hashType: props.thumbhash ? 'thumbhash' : 'blurhash',
      size: props.placeholderSize || unlazy.placeholderSize,
      ratio: props.placeholderRatio,
    })

    if (placeholder)
      target.value.src = placeholder

    lastHash = hash.value
  }

  if (props.preload) {
    if (props.autoSizes)
      _autoSizes(target.value)
    loadImage(target.value)
    emit('loaded', target.value)
    return
  }

  if (!props.lazyLoad)
    return

  // Placeholder is already decoded
  cleanup = lazyLoad(target.value, {
  hash: false,
  transition: props.transition,  // Add this line
  onImageLoad(image) {
    emit('loaded', image)
  },
})
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <picture v-if="props.sources?.length">
    <source
      v-for="(source, index) in props.sources"
      :key="index"
      :type="source.type"
      :data-srcset="source.srcSet"
      :data-sizes="source.sizes"
    >
    <img
      ref="target"
      v-bind="$attrs"
      :src="pngPlaceholder || placeholderSrc"
      :data-src="src"
      :data-srcset="srcSet"
      :data-sizes="autoSizes ? 'auto' : undefined"
      loading="lazy"
      @error="emit('error', $event)"
    >
  </picture>
  <img
    v-else
    ref="target"
    v-bind="$attrs"
    :src="pngPlaceholder || placeholderSrc"
    :data-src="src"
    :data-srcset="srcSet"
    :data-sizes="autoSizes ? 'auto' : undefined"
    loading="lazy"
    @error="emit('error', $event)"
  >
</template>
