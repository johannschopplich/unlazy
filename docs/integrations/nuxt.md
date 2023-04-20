# `@unlazy/nuxt`

unlazy is not only framework-agnostic, but also provides a Nuxt module that you can use in your Nuxt application.

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
  modules: ['@unlazy/nuxt'],

  // Module optoins
  unlazy: {
    blurhash: {
      // Whether the BlurHash should be decoded on the server
      ssr: true,

      // The size of the longer edge (width or height) of the
      // decoded BlurHash image, depending on the aspect ratio
      size: 32
    }
  }
})
```

## `UnLazyImage` Component

The `UnLazyImage` component is [globally available](https://nuxt.com/docs/guide/concepts/auto-imports) in your Nuxt application.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `blurhashSize` | Number | The size of the longer edge (width or height) of the decoded BlurHash image, depending on the aspect ratio. This value will be used to calculate the dimensions of the generated blurry placeholder from a BlurHash string. |
| `blurhashRatio` | Number | Aspect ratio (width / height) of the decoded BlurHash image. Only applies to SSR-decoded placeholder images from BlurHash. |
| `ssr` | Boolean | Whether the BlurHash should be decoded on the server. Overrides the global module config if set. |

## Examples

In both examples, the `sizes` attribute is automatically calculated.

```html
<!-- Your placeholder image in `src` attribute (provided by your backend for example) -->
<LazyImage
  src="data:image/svg+xml, ..."
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>

<!-- SSR-decoded BlurHash -->
<UnLazyImage
  :blurhash="blurhash"
  :blurhash-ratio="2"
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  width="640"
  height="320"
/>

<!-- Client-decoded BlurHash -->
<UnLazyImage
  :blurhash="blurhash"
  :ssr="false"
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  width="640"
  height="320"
/>
```
