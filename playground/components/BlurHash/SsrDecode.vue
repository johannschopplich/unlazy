<script setup lang="ts">
import { lazyLoad } from 'unlazy'
import { createPngDataUriFromBlurHash } from 'unlazy/blurhash'

const props = defineProps<{
  blurhash: string
  ratio?: number
}>()

const pngPlaceholder = createPngDataUriFromBlurHash(props.blurhash, { ratio: props.ratio })
const target = ref<HTMLImageElement | undefined>()

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
