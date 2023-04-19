<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { lazyLoad } from 'unlazy'

defineProps<{
  blurhash?: string
  autoSizes?: boolean
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
  <img
    ref="target"
    :data-blurhash="blurhash"
    :data-sizes="autoSizes ? 'auto' : undefined"
    loading="lazy"
  >
</template>
