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

The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop. It also enables you to specify a `blurhash` or `thumbhash` for the blurry placeholder image.

### Props

The `UnLazyImage` component accepts the following props:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | String | - | Image source URL to be lazy-loaded. |
| `srcSet` | String | - | Image source set to be lazy-loaded. |
| `autoSizes` | Boolean | `false` | Whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | - | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | - | A ThumbHash string representing the blurry placeholder image. If both are provided, `thumbhash` takes precedence. |
| `placeholderSrc` | String | - | Optional image source URL for a custom placeholder image. Ignored if a hash is provided. |
| `placeholderSize` | Number | `32` | The size of the longer edge for BlurHash decoding. Ignored for ThumbHash. |
| `loading` | String | `'lazy'` | Loading strategy for the image (`'lazy'` or `'eager'`). |

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
:::

::: tip
In each example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::
