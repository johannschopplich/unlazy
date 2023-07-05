# `@unlazy/nuxt`

unlazy is not only framework-agnostic, but also provides a Nuxt module that you can use in your Nuxt application.

The auto-imported `UnLazyImage` component is a drop-in replacement for the native `<img>` element and `<picture>` element respectively if you provide the `sources` prop.

## Installation

Install the `@unlazy/nuxt` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add -D @unlazy/nuxt
  ```
  ```bash [yarn]
  yarn add -D @unlazy/nuxt
  ```
  ```bash [npm]
  npm install -D @unlazy/nuxt
  ```
:::

Add the `@unlazy/nuxt` module to your Nuxt configuration:

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['@unlazy/nuxt']
})
```

## Module Options

The `@unlazy/nuxt` module accepts the following options:

```ts
export interface ModuleOptions {
  /**
   * Whether to generate the blurry placeholder on the server-side if a BlurHash
   * or ThumbHash is provided via the `blurhash`, respectively `thumbhash` prop.
   *
   * @default true
   */
  ssr?: boolean

  /**
   * The size of the longer edge (width or height) of the BlurHash image to be
   * decoded, depending on the aspect ratio.
   *
   * @remarks
   * This option is ignored if the a ThumbHash is used.
   *
   * @default 32
   */
  placeholderSize?: number
}
```

Adapt the module options to your needs:

```ts
// `nuxt.config.ts`
export default defineNuxtConfig({
  modules: ['@unlazy/nuxt'],

  // Module options
  unlazy: {
    ssr: false
  }
})
```

::: warning
Disabling server-side rendering of the blurry placeholder image will result in a flash of the original image on the initial page load and kinda defeats the purpose of the SSR abilities from Nuxt.
:::

## `UnLazyImage` Component

The `UnLazyImage` component is [globally available](https://nuxt.com/docs/guide/concepts/auto-imports) in your Nuxt application.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `src` | String | Image source URL to be lazy-loaded. |
| `srcSet` | String | Image source set to be lazy-loaded. |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `thumbhash` | String | A ThumbHash string representing the blurry placeholder image. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `placeholderSrc` | String | Optional image source URL for a custom placeholder image. Will be ignored if a BlurHash or ThumbHash is provided. |
| `placeholderSize` | Number | The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. |
| `placeholderRatio` | Number | Aspect ratio (width / height) of the decoded BlurHash image. Only applies to SSR-decoded placeholder images from a BlurHash string. |
| `lazyLoad` | Boolean | A flag to indicate whether the image should be lazy-loaded (default) or deferred until this prop is set to `true`. Note: Placeholder images from hashes will still be decoded. |
| `preload` | Boolean | A flag to indicate whether the image should be preloaded, even if it's not in the viewport yet. |
| `ssr` | Boolean | Whether the ThumbHash or BlurHash should be decoded on the server. Overrides the global module configuration if set. |

## Examples

::: tip
In every `srcSet` example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::

### Inlined placeholder image

```html [Inlined placeholder image]
<UnLazyImage
  placeholder-src="data:image/svg+xml, ..."
  src="/foo/bar.jpg"
/>
```

### BlurHash

::: code-group
  ```html [SSR-decoded BlurHash]
  <UnLazyImage
    :blurhash="blurhash"
    :blurhash-ratio="2"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    width="640"
    height="320"
  />
  ```
  ```html [Client-side decoded BlurHash]
  <UnLazyImage
    :ssr="false"
    :blurhash="blurhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    width="640"
    height="320"
  />
  ```
:::

### ThumbHash

::: code-group
  ```html [SSR-decoded ThumbHash]
  <UnLazyImage
    :thumbhash="thumbhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    width="640"
    height="320"
  />
  ```
  ```html [Client-side decoded ThumbHash]
  <UnLazyImage
    :ssr="false"
    :thumbhash="thumbhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    width="640"
    height="320"
  />
  ```
:::

### Multiple image sources

In this example, we're using the `UnLazyImage` component with an `exampleImgSrc` for the default image source, and an array of objects named `exampleSources` for the `sources` prop. Each object in the array includes a `type` and a `srcSet` property. In addition, the `blurhash` attribute is set to a predefined BlurHash string, and the `autoSizes` attribute is set to `true`, which will enable automatic calculation of the `sizes` attribute.

```vue
<script setup lang="ts">
const exampleImgSrc = '/images/foo.jpg'
const exampleSources = [
  {
    type: 'image/webp',
    srcSet: '/images/foo.webp 1x, /images/foo@2x.webp 2x'
  },
  {
    type: 'image/jpeg',
    srcSet: '/images/foo.jpg 1x, /images/foo@2x.jpg 2x'
  }
]
</script>

<template>
  <UnLazyImage
    :src="exampleImgSrc"
    :sources="exampleSources"
    blurhash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
    auto-sizes
  />
</template>
```

### Preload Image

Useful if the `UnLazyImage` is part of e.g. a slider, and you want to preload the next image.

```vue
<template>
  <UnLazyImage
    :blurhash="blurhash"
    src-set="image-320w.jpg 320w, image-640w.jpg 640w"
    auto-sizes
    preload
  />
</template>
