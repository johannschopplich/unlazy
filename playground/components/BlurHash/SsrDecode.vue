<script setup lang="ts">
import { lazyLoad } from 'unlazy'
import { createPngDataUri } from 'unlazy/blurhash'

const props = defineProps<{
  blurhash: string
  ratio?: number
}>()

const emit = defineEmits<{
  (event: 'updateDataUri', value: string): void
}>()

const target = ref<HTMLImageElement | undefined>()

// SSR-Generate a PNG data URI from the BlurHash
const pngPlaceholder = createPngDataUri(props.blurhash, { ratio: props.ratio })
emit('updateDataUri', pngPlaceholder)

onMounted(() => {
  if (target.value) {
    const cleanup = lazyLoad(target.value)
    onBeforeUnmount(cleanup)
  }
})
</script>

<template>
  <img ref="target" :src="pngPlaceholder" loading="lazy">
</template>
