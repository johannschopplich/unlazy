<script setup lang="ts">
import type { ResolveImageAttributesOptions } from 'unlazy'
import { createPlaceholderFromHash, lazyLoad as lazyLoadImage, resolveImageAttributes } from 'unlazy'
import { computed, ref, watch } from 'vue'

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
// `attributes` changes with every new `sources` array, `loadKey` only with its content.
const loadKey = computed(() => attributes.value.loadKey)

// Runs after the patch, so it reads the `data-*` attributes of the new props.
watch([target, loadKey], ([image], _, onCleanup) => {
  if (!image)
    return

  const { lazyLoadOptions } = attributes.value
  if (!props.lazyLoad && !props.preload) {
    const placeholder = createPlaceholderFromHash({
      image,
      hash: lazyLoadOptions.hash,
      hashType: lazyLoadOptions.hashType,
      size: lazyLoadOptions.placeholderSize,
    })
    if (placeholder)
      image.src = placeholder
    return
  }

  onCleanup(lazyLoadImage(image, { ...lazyLoadOptions, ...outcomeCallbacks }))
}, { flush: 'post', immediate: true })
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
    >
  </picture>
  <img
    v-else
    ref="target"
    v-bind="{ ...$attrs, ...attributes.image }"
  >
</template>
