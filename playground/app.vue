<script setup lang="ts">
import { createPngDataUriFromBlurHash } from 'unlazy/blurhash'
import '@unocss/reset/tailwind.css'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngPlaceholder = createPngDataUriFromBlurHash(blurhash, { ratio: 2 })
const logoUrl = new URL('../docs/public/logo.svg', import.meta.url).href

function toKb(bytes: number) {
  return (bytes / 1024).toFixed(2)
}
</script>

<template>
  <Head>
    <Title>unlazy</Title>
    <Link rel="icon" :href="logoUrl" type="image/svg+xml" />
  </Head>

  <main class="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <div class="space-y-2">
        <PlaygroundDivider>SSR-decoded BlurHash as <strong>PNG</strong> data URI</PlaygroundDivider>
        <p class="text-sm text-gray-500">
          The image below is inlined as a PNG data URI. String length: {{ pngPlaceholder.length }} ({{ toKb(pngPlaceholder.length) }} KB)
        </p>
        <BlurHashSsrDecode :blurhash="blurhash" :ratio="2" width="640" height="320" />
      </div>

      <div class="space-y-2">
        <PlaygroundDivider>Client-side decoded BlurHash</PlaygroundDivider>
        <p class="text-sm text-gray-500">
          The client-side decoded BlurHash will infer the image dimensions from the <code>width</code> and <code>height</code> attributes.
        </p>
        <BlurHashClientDecode :blurhash="blurhash" width="640" height="320" />
      </div>
    </div>
  </main>
</template>
