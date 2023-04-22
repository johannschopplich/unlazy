<script setup lang="ts">
import { PlaygroundDivider, UnLazyImage } from '#components'
import '@unocss/reset/tailwind.css'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const thumbhash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
const logoUrl = new URL('../../../docs/public/logo.svg', import.meta.url).href
</script>

<template>
  <Head>
    <Title>@unlazy/nuxt</Title>
    <Link rel="icon" :href="logoUrl" type="image/svg+xml" />
  </Head>

  <main class="mx-auto max-w-xl px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-6">
      <div class="space-y-2">
        <PlaygroundDivider>SSR-decoded BlurHash as <strong>PNG</strong> data URI</PlaygroundDivider>
        <p class="text-sm text-gray-500">
          The image below is inlined as a PNG data URI.
        </p>
        <UnLazyImage
          :blurhash="blurhash"
          :blurhash-ratio="2"
          data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
          width="640"
          height="320"
        />
      </div>

      <div class="space-y-2">
        <PlaygroundDivider>Client-side decoded BlurHash</PlaygroundDivider>
        <p class="text-sm text-gray-500">
          The client-side decoded BlurHash will infer the image dimensions from the <code>width</code> and <code>height</code> attributes.
        </p>
        <UnLazyImage
          :ssr="false"
          :blurhash="blurhash"
          :blurhash-ratio="2"
          data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
          width="640"
          height="320"
        />
      </div>

      <div class="space-y-2">
        <PlaygroundDivider>SSR-decoded ThumbHash as <strong>PNG</strong> data URI</PlaygroundDivider>
        <p class="text-sm text-gray-500">
          The image below is inlined as a PNG data URI.
        </p>
        <UnLazyImage
          :thumbhash="thumbhash"
          data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
          width="320"
          height="1280"
        />
      </div>

      <div class="space-y-2">
        <PlaygroundDivider>Client-side decoded ThumbHash</PlaygroundDivider>
        <UnLazyImage
          :ssr="false"
          :thumbhash="thumbhash"
          data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
          width="320"
          height="1280"
        />
      </div>
    </div>
  </main>
</template>
