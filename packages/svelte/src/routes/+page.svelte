<script lang='ts'>
  import UnLazyImage from '../lib/UnLazyImage.svelte'

  function onImageLoad(image: HTMLImageElement) {
    console.log('Image loaded:', image.src)
  }

  function onImageError(image: HTMLImageElement, error: Event) {
    console.error('Image error:', image.src, error)
  }
</script>

<main>
  <h1>@unlazy/svelte Playground</h1>

  <section>
    <h2>BlurHash</h2>
    <UnLazyImage
      blurhash='LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
      src='/images/fall-evan-wallace.jpg'
      width={640}
      height={427}
      {onImageLoad}
      {onImageError}
    />
  </section>

  <section>
    <h2>ThumbHash</h2>
    <UnLazyImage
      thumbhash='1QcSHQRnh493V4dIh4eXh1h4kJUI'
      src='/images/sunrise-evan-wallace.jpg'
      width={480}
      height={640}
    />
  </section>

  <section>
    <h2>Preload (immediate)</h2>
    <UnLazyImage
      blurhash='HBkSHYSIeHiPiHh8eJd4eTN0EEQG'
      src='/images/fall-evan-wallace.jpg'
      preload
      width={640}
      height={427}
    />
  </section>

  <section>
    <h2>Custom Placeholder</h2>
    <UnLazyImage
      placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='480' height='640'%3E%3Crect fill='%23ccc' width='100%25' height='100%25'/%3E%3C/svg%3E"
      src='/images/sunrise-evan-wallace.jpg'
      width={480}
      height={640}
    />
  </section>
</main>

<style>
  main { max-width: 800px; margin: 0 auto; padding: 2rem; }
  h1 { margin-bottom: 2rem; }
  section { margin-bottom: 2rem; }
  h2 { margin-bottom: 0.5rem; font-size: 1rem; color: #666; }
  :global(img) { display: block; max-width: 100%; height: auto; }
</style>
