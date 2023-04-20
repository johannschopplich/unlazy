<script setup lang="ts">
import { lazyLoad } from 'unlazy'

const props = defineProps<{
  blurhash: string
}>()

const target = ref<HTMLImageElement | undefined>()

onMounted(() => {
  if (target.value) {
    const cleanup = lazyLoad(target.value, {
      blurhash: props.blurhash,
    })
    onBeforeUnmount(cleanup)
  }
})
</script>

<template>
  <img ref="target" loading="lazy">
</template>
