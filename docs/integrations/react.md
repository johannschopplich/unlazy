# `@unlazy/react`

The React integration provides an `UnLazyImage` component for your React 18 or 19 application.

## Installation

Install the `@unlazy/react` package using your favorite package manager:

::: code-group
  ```bash [pnpm]
  pnpm add @unlazy/react
  ```
  ```bash [yarn]
  yarn add @unlazy/react
  ```
  ```bash [npm]
  npm install @unlazy/react
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

The package carries the `'use client'` directive, so a Server Component can render `UnLazyImage` directly.

## `UnLazyImage` Component

`UnLazyImage` renders a lazy-loaded `<img>`, or a `<picture>` when you pass `sources`.

### Props

`UnLazyImage` takes the [props every integration shares](/integrations/#unlazyimage-props) and these callbacks:

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `onImageLoad` | Function | - | Callback function invoked when the image has been successfully loaded. Receives the `HTMLImageElement` as an argument. |
| `onImageError` | Function | - | Callback function invoked when an error occurs during image loading. Receives the `HTMLImageElement` and `Event` as arguments. |

The component also accepts all standard `<img>` HTML attributes (e.g., `alt`, `className`, `style`) and forwards a `ref` to the `<img>`.

## Examples

```tsx
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

For a ThumbHash, pass `thumbhash` instead of `blurhash`. For an inlined placeholder image, pass `placeholderSrc="data:image/svg+xml, ..."` instead.

::: info
When using BlurHash, set explicit `width` and `height` props. See [Hash-Based Placeholders](/guide/placeholders#using-data-attributes) for why.
:::

### Multiple Image Sources

Pass an array of [`UnLazySource`](/integrations/#unlazysource) objects as `sources` to render a `<picture>` element with format negotiation and art direction. Each entry becomes a `<source>` child:

```tsx
import type { UnLazySource } from '@unlazy/react'

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
