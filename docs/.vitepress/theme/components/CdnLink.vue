<script setup lang="ts">
import { version } from '../../meta'

withDefaults(
  defineProps<{
    name: string
    provider?: 'unpkg' | 'jsdelivr'
  }>(),
  {
    provider: 'unpkg',
  },
)
</script>

<template>
  <a :href="`https://${unpkg}.com/unlazy@${version}/dist/${name}`" target="_blank" rel="noreferrer">
    {{ `${unpkg}.com/unlazy@${version}/dist/${name}` }}
  </a>
</template>
