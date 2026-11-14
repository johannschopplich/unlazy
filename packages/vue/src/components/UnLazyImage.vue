<script setup lang="ts">
import type { ResolveImageAttributesOptions } from 'unlazy'
import { createPlaceholderFromHash, lazyLoad as lazyLoadImage, reportImageOutcome, resolveImageAttributes } from 'unlazy'
import { computed, ref, watchPostEffect } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ResolveImageAttributesOptions>(), {
  lazyLoad: true,
})

const emit = defineEmits<{
  (event: 'imageLoad', image: HTMLImageElement): void
  (event: 'imageError', image: HTMLImageElement, error: Event): void
}>()

const target = ref<HTMLImageElement | undefined>()
const outcomeCallbacks = {
  onImageLoad: (image: HTMLImageElement) => emit('imageLoad', image),
  onImageError: (image: HTMLImageElement, error: Event) => emit('imageError', image, error),
}
const attributes = computed(() => resolveImageAttributes(props))
// The effect reads single fields, since `attributes` changes with every new
// `sources` array.
const hasRealSources = computed(() => attributes.value.hasRealSources)
const sourcesKey = computed(() => attributes.value.sourcesKey)
const hash = computed(() => attributes.value.hash)
const hashType = computed(() => attributes.value.hashType)

// Runs after the patch, so it reads the `data-*` attributes of the new props.
watchPostEffect((onCleanup) => {
  const image = target.value
  if (!image || hasRealSources.value)
    return

  // Track changes to image sources to trigger reactivity.
  void props.src
  void props.srcSet
  void sourcesKey.value

  if (!props.lazyLoad && !props.preload) {
    const placeholder = createPlaceholderFromHash({
      image,
      hash: hash.value,
      hashType: hashType.value,
      size: props.placeholderSize,
    })
    if (placeholder)
      image.src = placeholder
    return
  }

  onCleanup(lazyLoadImage(image, {
    hash: hash.value,
    hashType: hashType.value,
    placeholderSize: props.placeholderSize,
    updateSizesOnResize: props.autoSizes,
    preload: props.preload,
    ...outcomeCallbacks,
  }))
})

// `lazyLoadImage` reports the outcome of the images it swaps; an image with its
// real sources in the markup reports its own.
function handleOutcome(event: Event) {
  if (hasRealSources.value)
    reportImageOutcome(event.currentTarget as HTMLImageElement, event, outcomeCallbacks)
}
</script>

<template>
  <picture v-if="sources?.length">
    <source
      v-for="(sourceAttributes, index) in attributes.sources"
      :key="index"
      v-bind="sourceAttributes"
    >
    <img
      ref="target"
      v-bind="{ ...$attrs, ...attributes.image }"
      @load="handleOutcome"
      @error="handleOutcome"
    >
  </picture>
  <img
    v-else
    ref="target"
    v-bind="{ ...$attrs, ...attributes.image }"
    @load="handleOutcome"
    @error="handleOutcome"
  >
</template>
