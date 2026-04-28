# `@unlazy/svelte`

The Svelte integration provides an `UnLazyImage` component for Svelte 5+ applications using runes.

## Installation

Install the `@unlazy/svelte` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add -D @unlazy/svelte
  ```
  ```bash [yarn]
  yarn add -D @unlazy/svelte
  ```
  ```bash [npm]
  npm install -D @unlazy/svelte
  ```
:::

Import the `UnLazyImage` component in your component file:

```svelte
<script lang='ts'>
  import { UnLazyImage } from '@unlazy/svelte'
</script>

<UnLazyImage
  blurhash='LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
  srcSet='image-320w.jpg 320w, image-640w.jpg 640w'
  autoSizes
/>
```

## `UnLazyImage` Component

The `UnLazyImage` component allows you to easily implement unlazy in your Svelte application, providing a smoother image loading experience.

The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop. It also enables you to specify a `blurhash` or `thumbhash` for the blurry placeholder image.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | String | - | Image source URL to be lazy-loaded. |
| `srcSet` | String | - | Image source set to be lazy-loaded. |
| `sources` | Array | - | Array of `UnLazySource` objects to render a `<picture>` element. |
| `autoSizes` | Boolean | `false` | Whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | - | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | - | A ThumbHash string representing the blurry placeholder image. If both are provided, `thumbhash` takes precedence. |
| `placeholderSrc` | String | - | Optional image source URL for a custom placeholder image. Ignored if a hash is provided. |
| `placeholderSize` | Number | `32` | The size of the longer edge for BlurHash decoding. Ignored for ThumbHash. |
| `preload` | Boolean | `false` | Whether the image should be preloaded immediately, bypassing lazy loading. |
| `loading` | String | `'lazy'` | Loading strategy for the image (`'lazy'` or `'eager'`). |
| `onImageLoad` | Function | - | Callback function invoked when the image has been successfully loaded. Receives the `HTMLImageElement` as an argument. |
| `onImageError` | Function | - | Callback function invoked when an error occurs during image loading. Receives the `HTMLImageElement` and `Event` as arguments. |

The component also accepts all standard `<img>` HTML attributes.

### Svelte 5 Runes

This component is built using Svelte 5's modern runes syntax:

- **`$props()`**: Declares component props with TypeScript typing and default values
- **`$state()`**: Creates a reactive state variable for the img element reference
- **`$effect()`**: Runs reactive effects when dependencies change, with automatic cleanup on unmount

## Examples

::: code-group
  ```svelte [BlurHash]
  <UnLazyImage
    width={800}
    height={600}
    blurhash='LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
    srcSet='image-320w.jpg 320w, image-640w.jpg 640w'
    autoSizes
  />
  ```
  ```svelte [ThumbHash]
  <UnLazyImage
    width={800}
    height={600}
    thumbhash='1QcSHQRnh493V4dIh4eXh1h4kJUI'
    srcSet='image-320w.jpg 320w, image-640w.jpg 640w'
    autoSizes
  />
  ```
  ```svelte [Inlined placeholder image]
  <UnLazyImage
    width={800}
    height={600}
    placeholderSrc='data:image/svg+xml, ...'
    srcSet='image-320w.jpg 320w, image-640w.jpg 640w'
    autoSizes
  />
  ```
:::

::: info
When using BlurHash, set explicit `width` and `height` props. See [Hash-Based Placeholders](/guide/placeholders#using-data-attributes) for why.
:::

::: tip
In each example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::

### Multiple Image Sources

Pass `sources` to render a `<picture>` element with format negotiation and art direction. Each entry becomes a `<source>` child:

```svelte
<script lang='ts'>
  import type { UnLazySource } from 'unlazy'
  import { UnLazyImage } from '@unlazy/svelte'

  const sources: UnLazySource[] = [
    { type: 'image/avif', srcSet: 'hero.avif 1x, hero@2x.avif 2x' },
    {
      media: '(max-width: 600px)',
      srcSet: 'hero-mobile.jpg',
      width: 480,
      height: 640,
    },
  ]
</script>

<UnLazyImage
  src='/hero.jpg'
  {sources}
  width={640}
  height={427}
/>
```

::: tip
Set `width` and `height` per source to prevent layout shift when the breakpoint changes. Modern browsers use the matched `<source>`'s dimensions for the rendered `<img>`'s aspect ratio.
:::

### Preload Image

Useful if the `UnLazyImage` is part of e.g. a slider, and you want to preload the next image.

```svelte
<UnLazyImage
  blurhash='LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
  srcSet='image-320w.jpg 320w, image-640w.jpg 640w'
  autoSizes
  preload
/>
```
