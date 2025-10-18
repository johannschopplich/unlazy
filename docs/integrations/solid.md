# `@unlazy/solid`

The Solid integration provides an `UnLazyImage` component for your Solid 1.9+ application.

## Installation

Install the `@unlazy/solid` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add -D @unlazy/solid
  ```
  ```bash [yarn]
  yarn add -D @unlazy/solid
  ```
  ```bash [npm]
  npm install -D @unlazy/solid
  ```
:::

Import the `UnLazyImage` component in your component file:

```tsx
import { UnLazyImage } from '@unlazy/solid'

export default function MyComponent() {
  return (
    <UnLazyImage
      blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
    />
  )
}
```

## `UnLazyImage` Component

The `UnLazyImage` component allows you to easily implement unlazy in your Solid application, providing a smoother image loading experience.

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

### Solid.js Reactivity

This component uses Solid.js's fine-grained reactivity primitives:

- **`createSignal()`**: Creates a reactive signal for storing the img element reference
- **`createEffect()`**: Runs when tracked signals change, automatically setting up lazy loading
- **`onCleanup()`**: Registers cleanup function to remove event listeners on unmount
- **`splitProps()`**: Separates component-specific props from HTML attributes to be forwarded

## Examples

::: code-group
  ```tsx [BlurHash]
  return (
    <UnLazyImage
      blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
    />
  )
  ```
  ```tsx [ThumbHash]
  return (
    <UnLazyImage
      thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
    />
  )
  ```
  ```tsx [Inlined placeholder image]
  return (
    <UnLazyImage
      placeholderSrc="data:image/svg+xml, ..."
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
    />
  )
  ```
:::

::: tip
In each example, the `sizes` attribute is automatically calculated given the `auto-sizes` prop.
:::
