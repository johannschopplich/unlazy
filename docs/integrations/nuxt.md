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
| `ssr` | Boolean | Whether the ThumbHash or BlurHash should be decoded on the server. Overrides the global module configuration if set. |

## Examples

```html
<!-- Inlined placeholder image as data URI -->
<UnLazyImage
  placeholder-src="data:image/svg+xml, ..."
  src-set="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>
```

::: tip
In every `srcSet` example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::

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
