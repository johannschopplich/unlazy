<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { lazyLoad } from 'unlazy'

const props = defineProps<{
  autoSizes?: boolean
  blurhash?: string
  blurhashSize?: number
}>()

const target = ref<HTMLImageElement | undefined>()
let cleanup: () => void

onMounted(() => {
  watchEffect(() => {
    cleanup?.()

    if (!target.value)
      return

    cleanup = lazyLoad(target.value, {
      blurhash: props.blurhash,
      blurhashSize: props.blurhashSize,
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
    :data-sizes="autoSizes ? 'auto' : undefined"
    loading="lazy"
  >
</template>
