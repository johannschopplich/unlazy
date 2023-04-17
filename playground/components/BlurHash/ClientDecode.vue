<script setup lang="ts">
import { lazyLoad } from 'unlazy'

defineProps<{
  blurhash: string
}>()

const target = ref<HTMLImageElement | undefined>()

onMounted(() => {
  if (target.value) {
    const cleanup = lazyLoad(target.value)
    onBeforeUnmount(cleanup)
  }
})
</script>

<template>
  <img ref="target" :data-blurhash="blurhash" loading="lazy">
</template>
