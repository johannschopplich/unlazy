# `@unlazy/solid`

unlazy is not only framework-agnostic, but also provides a Solid component that you can use in your Solid application.

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

Import the `LazyImage` component in your component file:

```tsx
import { LazyImage } from '@unlazy/solid'

export default function MyComponent() {
  return (
    <LazyImage
      autoSizes
      src="data:image/svg+xml, ..."
      data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    />
  )
}
```

## `LazyImage` Component

The `LazyImage` component allows you to easily implement unlazy in your Solid application, providing a smoother image loading experience.

The component supports automatic calculation of the `sizes` attribute with the `autoSizes` prop. It also enables you to specify a `blurhash` for the blurry placeholder image.

### Props

The `LazyImage` component accepts the following props:

| Prop | Type | Description |
| --- | --- | --- |
| `autoSizes` | Boolean | A flag to indicate whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | A BlurHash string representing the blurry placeholder image. |
| `blurhashSize` | Number | The size of the longer edge (width or height) of the decoded BlurHash image, depending on the aspect ratio. This value will be used to calculate the dimensions of the generated blurry placeholder from a BlurHash string. |

## Examples

In both examples, the `sizes` attribute is automatically calculated.

```tsx
return (
  <>
    {/* BlurHash in `blurhash` attribute */}
    <LazyImage
      blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
      autoSizes
      data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    />

    {/* Encoded image in `src` attribute */}
    <LazyImage
      autoSizes
      src="data:image/svg+xml, ..."
      data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    />
  </>
)
```
