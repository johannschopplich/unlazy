# `@unlazy/svelte`

unlazy is not only framework-agnostic, but also provides a Svelte component that you can use in your Svelte application.

::: info
The component is written for Svelte 5 and above using runes.
:::

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
<script lang="ts">
  import { UnLazyImage } from '@unlazy/svelte'
</script>

<UnLazyImage
  blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
  srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
  autoSizes
/>
```

## `UnLazyImage` Component

The `UnLazyImage` component allows you to easily implement unlazy in your Svelte application, providing a smoother image loading experience.

The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop. It also enables you to specify a `blurhash` for the blurry placeholder image.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `src` | String | Image source URL to be lazy-loaded. |
| `srcSet` | String | Image source set to be lazy-loaded. |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | A ThumbHash string representing the blurry placeholder image. |
| `placeholderSrc` | String | Optional image source URL for a custom placeholder image. Will be ignored if a BlurHash or ThumbHash is provided. |
| `placeholderSize` | Number | The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. |
| `transition` | Number | Time in MS for BlurHash/ThumbHash to transition to lazy loaded image. |

## Examples

::: code-group
  ```svelte [BlurHash]
  <UnLazyImage
    blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
    srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
    autoSizes
  />
  ```
  ```svelte [ThumbHash]
  <UnLazyImage
    thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
    srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
    autoSizes
  />
  ```
  ```svelte [Inlined placeholder image]
  <UnLazyImage
    placeholderSrc="data:image/svg+xml, ..."
    srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
    autoSizes
  />
  ```
  ```svelte [Transition]
  <UnLazyImage
    thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
    transition={500}
  />
  ```
:::

::: tip
In each example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::
