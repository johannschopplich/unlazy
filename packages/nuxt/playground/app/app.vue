<script setup lang="ts">
import { PlaygroundDivider, UnLazyImage } from '#components'
import { ref, useHead } from '#imports'
import '@unocss/reset/tailwind.css'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const thumbhash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
const logoUrl = new URL('../../../docs/public/logo.svg', import.meta.url).href

const shouldLoadImage = ref(false)

useHead({
  title: '@unlazy/nuxt',
  link: [
    { rel: 'icon', href: logoUrl, type: 'image/svg+xml' },
  ],
})

function loadImage() {
  shouldLoadImage.value = true
}
</script>

<template>
  <main class="mx-auto max-w-prose px-4 py-12 sm:px-6 lg:px-8">
    <div class="space-y-12">
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <PlaygroundDivider><strong>SSR</strong>-decoded BlurHash</PlaygroundDivider>
          <UnLazyImage
            :blurhash="blurhash"
            src-set="image-320w.jpg 320w, image-640w.jpg 640w"
            width="640"
            height="320"
            style="aspect-ratio: 1/1;"
          />
          <p class="text-sm text-gray-500">
            The image above is inlined as a PNG data URI.
          </p>
        </div>
        <div class="space-y-2">
          <PlaygroundDivider><strong>Client-side</strong> decoded BlurHash</PlaygroundDivider>
          <UnLazyImage
            :ssr="false"
            :blurhash="blurhash"
            src-set="image-320w.jpg 320w, image-640w.jpg 640w"
            width="640"
            height="320"
            style="aspect-ratio: 1/1;"
          />
          <p class="text-sm text-gray-500">
            The client-side decoded BlurHash will infer the image dimensions from the <code>width</code> and <code>height</code> attributes.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <PlaygroundDivider><strong>SSR</strong>-decoded ThumbHash</PlaygroundDivider>
          <UnLazyImage
            :thumbhash="thumbhash"
            src="/images/sunrise-evan-wallace.jpg"
            width="480"
            height="640"
            style="aspect-ratio: 3/4;"
          />
          <p class="text-sm text-gray-500">
            The image above is inlined as a PNG data URI.
          </p>
        </div>

        <div class="space-y-2">
          <PlaygroundDivider><strong>Client-side</strong> decoded ThumbHash</PlaygroundDivider>
          <UnLazyImage
            :ssr="false"
            :thumbhash="thumbhash"
            src="/images/sunrise-evan-wallace.jpg"
            width="480"
            height="640"
            style="aspect-ratio: 3/4;"
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <PlaygroundDivider>Lazy load on click</PlaygroundDivider>
          <UnLazyImage
            thumbhash="HBkSHYSIeHiPiHh8eJd4eTN0EEQG"
            :lazy-load="shouldLoadImage"
            src="/images/fall-evan-wallace.jpg"
            width="480"
            height="640"
            style="aspect-ratio: 3/2;"
            @click="loadImage"
          />
          <p class="text-sm text-gray-500">
            Lazy loading will only be triggered when the image is clicked.
          </p>
        </div>
      </div>
    </div>
  </main>
</template>
