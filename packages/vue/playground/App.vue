<script setup lang="ts">
import { UnLazyImage } from '../src/components'
</script>

<template>
  <UnLazyImage
    blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    width="640"
    height="640"
  />
  <UnLazyImage
    thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
    src="/images/sunrise-evan-wallace.jpg"
    width="480"
    :transition="500"
    height="640"
  />
</template>
