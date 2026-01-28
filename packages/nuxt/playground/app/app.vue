<script setup lang="ts">
import { UnLazyImage } from '#components'
import { ref, useHead } from '#imports'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const thumbhash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'

const shouldLoadImage = ref(false)

useHead({
  title: '@unlazy/nuxt',
})

function onLoaded(image: HTMLImageElement) {
  console.log('Image loaded:', image.src)
}
</script>

<template>
  <main>
    <h1>@unlazy/nuxt Playground</h1>

    <div class="grid">
      <section>
        <h2>SSR-decoded BlurHash</h2>
        <UnLazyImage
          :blurhash="blurhash"
          src="/images/fall-evan-wallace.jpg"
          width="640"
          height="427"
          @loaded="onLoaded"
        />
      </section>

      <section>
        <h2>Client-side BlurHash</h2>
        <UnLazyImage
          :ssr="false"
          :blurhash="blurhash"
          src="/images/fall-evan-wallace.jpg"
          width="640"
          height="427"
        />
      </section>
    </div>

    <div class="grid">
      <section>
        <h2>SSR-decoded ThumbHash</h2>
        <UnLazyImage
          :thumbhash="thumbhash"
          src="/images/sunrise-evan-wallace.jpg"
          width="480"
          height="640"
        />
      </section>

      <section>
        <h2>Client-side ThumbHash</h2>
        <UnLazyImage
          :ssr="false"
          :thumbhash="thumbhash"
          src="/images/sunrise-evan-wallace.jpg"
          width="480"
          height="640"
        />
      </section>
    </div>

    <div class="grid">
      <section>
        <h2>Preload (immediate)</h2>
        <UnLazyImage
          blurhash="HBkSHYSIeHiPiHh8eJd4eTN0EEQG"
          src="/images/fall-evan-wallace.jpg"
          width="640"
          height="427"
          preload
        />
      </section>

      <section>
        <h2>Lazy load on click</h2>
        <UnLazyImage
          thumbhash="HBkSHYSIeHiPiHh8eJd4eTN0EEQG"
          :lazy-load="shouldLoadImage"
          src="/images/fall-evan-wallace.jpg"
          width="640"
          height="427"
          style="cursor: pointer;"
          @click="shouldLoadImage = true"
        />
        <p>Click image to load</p>
      </section>
    </div>
  </main>
</template>

<style>
main {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}
h1 { margin-bottom: 2rem; }
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
}
section h2 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: #666;
}
section p {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #999;
}
img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
