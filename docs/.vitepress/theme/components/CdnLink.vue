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
  <a :href="`https://${provider}.com/unlazy@${version}/dist/${name}`" target="_blank" rel="noreferrer">
    {{ `${provider}.com/unlazy@${version}/dist/${name}` }}
  </a>
</template>
