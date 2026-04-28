<script setup lang="ts">
import type { UnLazySource } from 'unlazy'
import type { ImgHTMLAttributes } from 'vue'
import type { ModuleOptions } from '../../module'
import { autoSizes as _autoSizes, createPlaceholderFromHash, lazyLoad, triggerLoad } from 'unlazy'
import { computed, ref, useRuntimeConfig, watchEffect } from '#imports'

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
    /** Aspect ratio (width / height) of the decoded BlurHash image. Only applies to SSR-decoded placeholder images from a BlurHash string. */
    placeholderRatio?: number
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
    /**
     * Allows to specify the loading strategy of the image.
     * @default 'lazy'
     */
    loading?: ImgHTMLAttributes['loading']
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
    lazyLoad: true,
    preload: false,
    ssr: undefined,
    loading: undefined,
  },
)

const emit = defineEmits<{
  (event: 'imageLoad', image: HTMLImageElement): void
  (event: 'imageError', image: HTMLImageElement, error: Event): void
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
let lastHash: string | undefined

watchEffect((onCleanup) => {
  if (!target.value)
    return

  // Track changes to image sources to trigger reactivity
  void props.src
  void props.srcSet
  void props.sources

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
    const cleanupSizes = props.autoSizes
      ? _autoSizes(target.value, { updateOnResize: true })
      : undefined
    const cleanupLoad = triggerLoad(target.value, {
      onImageLoad: image => emit('imageLoad', image),
      onImageError: (image, error) => emit('imageError', image, error),
    })
    onCleanup(() => {
      cleanupSizes?.()
      cleanupLoad()
    })
    return
  }

  if (!props.lazyLoad)
    return

  // Placeholder is already decoded
  const cleanup = lazyLoad(target.value, {
    hash: false,
    updateSizesOnResize: props.autoSizes,
    onImageLoad: image => emit('imageLoad', image),
    onImageError: (image, error) => emit('imageError', image, error),
  })
  onCleanup(cleanup)
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
      :src="pngPlaceholder || placeholderSrc"
      :data-src="src"
      :data-srcset="srcSet"
      :data-sizes="autoSizes ? 'auto' : undefined"
      :loading="loading || (props.lazyLoad ? 'lazy' : 'eager')"
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
    :loading="loading || (props.lazyLoad ? 'lazy' : 'eager')"
  >
</template>
