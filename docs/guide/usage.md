# Usage

These guides build on the markup and the `lazyLoad()` call from [Getting Started](/guide/).

## Calculate the `sizes` Attribute Automatically

Set `data-sizes="auto"`, and unlazy sets the `sizes` attribute to the display width of the image:

```html
<img
  loading="lazy"
  src="data:image/svg+xml, ..."
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  data-sizes="auto"
  alt="Descriptive text"
  width="640"
  height="360"
>
```

Alternatively, use the [`autoSizes`](/api/auto-sizes) function to calculate the `sizes` attribute without lazy loading. Call it with an `<img>` inside a `<picture>` and it walks to every `<source data-sizes="auto">` sibling in the same call:

```ts
import { autoSizes } from 'unlazy'

// One-shot resolve for every matching element in the document
autoSizes()
```

For responsive layouts where the display width changes – fluid containers, breakpoint switches, orientation changes – pass `{ updateOnResize: true }` to keep `sizes` synced. `autoSizes` returns a cleanup function – call it when you no longer need the observer:

```ts
const cleanup = autoSizes(undefined, { updateOnResize: true })

// Later, when unmounting
cleanup()
```

[`lazyLoad`](/api/lazy-load) does the same with `updateSizesOnResize: true`, and the cleanup function it returns disconnects the observer too.

## Target Specific Images

Both [`lazyLoad`](/api/lazy-load) and [`autoSizes`](/api/auto-sizes) take a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements. To target images with a `data-custom-lazy` attribute, pass `img[data-custom-lazy]`:

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[data-custom-lazy]')
```

::: info
The `loading="lazy"` attribute is still required for the images to be lazy loaded.
:::

## Load an Image Manually

To load an image before it enters the viewport, call the [`triggerLoad`](/api/trigger-load) function with the `HTMLImageElement`:

```ts
import { triggerLoad } from 'unlazy'

const coolImage = document.querySelector<HTMLImageElement>('.image-to-load-first')!

// Trigger the load before the image enters the viewport
triggerLoad(coolImage)
```

::: tip
Manually loading images may negatively affect perceived performance by forcing immediate load, even when not visible in the viewport.
:::

## Lazy Load `<picture>` Elements

unlazy fully supports the `<picture>` element for art direction and format selection. Each `<source>` element should use `data-srcset` instead of `srcset`:

```html
<picture>
  <source
    type="image/avif"
    data-srcset="image-320w.avif 320w, image-640w.avif 640w"
    data-sizes="auto"
  />
  <source
    type="image/webp"
    data-srcset="image-320w.webp 320w, image-640w.webp 640w"
    data-sizes="auto"
  />
  <img
    loading="lazy"
    src="data:image/svg+xml, ..."
    data-src="image.jpg"
    data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
    data-sizes="auto"
    alt="Descriptive text"
    width="640"
    height="360"
  />
</picture>
```

When the image loads, unlazy automatically swaps `data-srcset` to `srcset` on all `<source>` elements within the `<picture>`. The `onImageLoad` and `onImageError` callbacks fire once the browser resolves a source on the visible `<img>`.
