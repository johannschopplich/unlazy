# `@unlazy/react`

The React integration provides an `UnLazyImage` component for your React 18 or 19 application.

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

Import the `UnLazyImage` component in your component file:

```tsx
import { UnLazyImage } from '@unlazy/react'

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

`UnLazyImage` renders a lazy-loaded `<img>`, or a `<picture>` when you pass `sources`.

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `src` | String | - | Image source URL to be lazy-loaded. |
| `srcSet` | String | - | Image source set to be lazy-loaded. |
| `sources` | Array | - | Array of [`UnLazySource`](/integrations/#unlazysource) objects to render a `<picture>` element. |
| `autoSizes` | Boolean | `false` | Whether the sizes attribute should be automatically calculated. |
| `blurhash` | String | - | A BlurHash string representing the blurry placeholder image. |
| `thumbhash` | String | - | A ThumbHash string representing the blurry placeholder image. If both are provided, `thumbhash` takes precedence. |
| `placeholderSrc` | String | - | Optional image source URL for a custom placeholder image. Ignored if a hash is provided. |
| `placeholderSize` | Number | `32` | The size of the longer edge for BlurHash decoding. Ignored for ThumbHash. |
| `preload` | Boolean | `false` | Whether the image should be preloaded immediately, bypassing lazy loading. |
| `loading` | String | `'lazy'` | Loading strategy for the image (`'lazy'` or `'eager'`). |
| `onImageLoad` | Function | - | Callback function invoked when the image has been successfully loaded. Receives the `HTMLImageElement` as an argument. |
| `onImageError` | Function | - | Callback function invoked when an error occurs during image loading. Receives the `HTMLImageElement` and `Event` as arguments. |

The component also accepts all standard `<img>` HTML attributes (e.g., `alt`, `className`, `style`).

## Examples

::: code-group
  ```tsx [BlurHash]
  return (
    <UnLazyImage
      width={800}
      height={600}
      blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
    />
  )
  ```
  ```tsx [ThumbHash]
  return (
    <UnLazyImage
      width={800}
      height={600}
      thumbhash="1QcSHQRnh493V4dIh4eXh1h4kJUI"
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
    />
  )
  ```
  ```tsx [Inlined placeholder image]
  return (
    <UnLazyImage
      width={800}
      height={600}
      placeholderSrc="data:image/svg+xml, ..."
      srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
      autoSizes
    />
  )
  ```
:::

::: tip
In each example, the `sizes` attribute is automatically calculated given the `autoSizes` prop.
:::

::: info
When using BlurHash, set explicit `width` and `height` props. See [Hash-Based Placeholders](/guide/placeholders#using-data-attributes) for why.
:::

### Multiple Image Sources

Pass `sources` to render a `<picture>` element with format negotiation and art direction. Each entry becomes a `<source>` child:

```tsx
import type { UnLazySource } from 'unlazy'

const sources: UnLazySource[] = [
  { type: 'image/avif', srcSet: 'hero.avif 1x, hero@2x.avif 2x' },
  {
    media: '(max-width: 600px)',
    srcSet: 'hero-mobile.jpg',
    width: 480,
    height: 640,
  },
]

return (
  <UnLazyImage
    src="/hero.jpg"
    sources={sources}
    width={640}
    height={427}
  />
)
```

::: tip
Set `width` and `height` per source to prevent layout shift when the breakpoint changes. Modern browsers use the matched `<source>`'s dimensions for the rendered `<img>`'s aspect ratio.
:::

### Preload Image

Set `preload` to load the image before it enters the viewport, for example the next slide of a slider:

```tsx
return (
  <UnLazyImage
    blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
    srcSet="image-320w.jpg 320w, image-640w.jpg 640w"
    autoSizes
    preload
  />
)
```
