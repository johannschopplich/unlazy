# `@unlazy/svelte`

unlazy is not only framework-agnostic, but also provides a Svelte component that you can use in your Svelte application.

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
  autoSizes
  src="data:image/svg+xml, ..."
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
/>
```

## `UnLazyImage` Component

The `UnLazyImage` component allows you to easily implement unlazy in your Svelte application, providing a smoother image loading experience.

The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop. It also enables you to specify a `blurhash` for the blurry placeholder image.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | A ThumbHash string representing the blurry placeholder image. |
| `placeholderSize` | Number | The size of the longer edge (width or height) of the BlurHash image to be decoded, depending on the aspect ratio. This option only applies when the `blurhash` prop is used. |

## Examples

::: info
In each example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::

::: code-group
  ```svelte [BlurHash]
  <UnLazyImage
    blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
    autoSizes
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  />
  ```
  ```svelte [ThumbHash]
  <UnLazyImage
    thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
    autoSizes
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  />
  ```
  ```svelte [Inlined placeholder image]
  <UnLazyImage
    autoSizes
    src="data:image/svg+xml, ..."
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  />
  ```
:::
