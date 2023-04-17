<script setup lang="ts">
import { lazyLoad } from '@unlazy/core'
import { createPngDataUriFromBlurHash } from '@unlazy/core/blurhash'
import '@unocss/reset/tailwind.css'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngPlaceholder = createPngDataUriFromBlurHash(blurhash, { ratio: 2 })

const lazyImage = ref<HTMLImageElement | undefined>()

onMounted(() => {
  const cleanup = lazyLoad(lazyImage.value)
  onUnmounted(cleanup)
})

function toKb(bytes: number) {
  return (bytes / 1024).toFixed(2)
}
</script>

<template>
  <Head>
    <Title>unlazy</Title>
    <Link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🌳</text></svg>" />
  </Head>

  <main class="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <div class="space-y-2">
        <PlaygroundDivider>SSR-decoded BlurHash as <strong>PNG</strong> data URI</PlaygroundDivider>
        <p class="text-sm text-gray-500">
          The image below is inlined as a PNG data URI. String length: {{ pngPlaceholder.length }} ({{ toKb(pngPlaceholder.length) }} KB)
        </p>
        <img :src="pngPlaceholder" loading="lazy" width="640" height="320">
      </div>

      <div class="space-y-2">
        <PlaygroundDivider>Client-side decoded BlurHash</PlaygroundDivider>
        <p class="text-sm text-gray-500">
          The client-side decoded BlurHash will infer the image dimensions from the <code>width</code> and <code>height</code> attributes.
        </p>
        <img
          ref="lazyImage"
          :data-blurhash="blurhash"
          loading="lazy"
          width="640"
          height="320"
        >
      </div>
    </div>
  </main>
</template>
