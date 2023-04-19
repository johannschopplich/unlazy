<script setup lang="ts">
import { version } from '../../meta'

defineProps<{
  name: string
}>()
</script>

<template>
  <a :href="`https://unpkg.com/unlazy@${version}/dist/${name}`" target="_blank" rel="noreferrer">
    {{ `unpkg.com/unlazy@${version}/dist/${name}` }}
  </a>
</template>
