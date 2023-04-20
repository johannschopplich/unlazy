# `@unlazy/react`

unlazy is not only framework-agnostic, but also provides a React component that you can use in your React application.

## Installation

Install the `@unlazy/react` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add -D @unlazy/react
  ```
  ```bash [yarn]
  yarn add -D @unlazy/react
  ```
  ```bash [npm]
  npm install -D @unlazy/react
  ```
:::

Import the `LazyImage` component in your component file:

```tsx
import { LazyImage } from '@unlazy/react'

export default function MyComponent() {
  return (
    <LazyImage
      src="data:image/svg+xml, ..."
      data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
      auto-sizes
    />
  )
}
```

## `LazyImage` Component

The `LazyImage` component allows you to easily implement unlazy in your React application, providing a smoother image loading experience. The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop It also enables you to specify a `blurhash` for the blurry placeholder image.

### Props

The `LazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `blurhashSize` | Number | The size of the longer edge (width or height) of the decoded BlurHash image, depending on the aspect ratio. This value will be used to calculate the dimensions of the generated blurry placeholder from a Blurhash string. |

## Examples

In both examples, the `sizes` attribute is automatically calculated.

```html
<!-- BlurHash -->
<LazyImage
  :blurhash="blurhash"
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>

<!-- Encoded image in `src` attribute -->
<LazyImage
  src="data:image/svg+xml, ..."
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  auto-sizes
/>
```
