# Usage

1. Add the `loading="lazy"` attribute to a `<img>` element that you want to lazily load. You can also use the `<picture>` element to lazily load images in different formats.

2. Use `data-src` or `data-srcset` attributes to specify the high-quality image. These prevent browsers from loading images before they enter the viewport and are swapped to standard attributes when loading occurs.

3. Set the `src` attribute with a pre-generated blurry placeholder, or use [hash-based placeholders](/placeholders/hash-based) (BlurHash or ThumbHash) to generate placeholders on the fly.

::: code-group
  ```html [Image tag]
  <!-- You can use the `<img>` tag -->
  <img
    loading="lazy"
    src="blurry placeholder ..."
    data-srcset="image.png"
    data-sizes="auto"
  >
  ```
  ```html [Picture tag]
  <!-- … or the `<picture>` tag -->
  <picture>
    <source
      type="image/webp"
      data-srcset="image-320w.webp 320w, image-640w.webp 640w"
      data-sizes="100w"
    />
    <img
      loading="lazy"
      src="blurry placeholder ..."
      data-src="lazy.jpg"
      data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
      data-sizes="auto"
    />
  </picture>
  ```
:::

::: tip
Set `data-sizes="auto"` to automatically calculate the `sizes` attribute when using `data-srcset`.
:::

4. In your frontend code, import the `lazyLoad` function from the library and call it:

```ts
import { lazyLoad } from 'unlazy'

// Lazily load all `img[loading="lazy"]` images
const cleanup = lazyLoad()

// Optional: Call cleanup() to remove event listeners and observers
// Useful when unmounting components or removing images dynamically
```

The `lazyLoad` function returns a cleanup function that removes event listeners and ResizeObservers. Call this when unmounting components or removing images to prevent memory leaks.

## Auto Calculation of the `sizes` Attribute

unlazy supports setting the `sizes` attribute automatically, corresponding to the current size of your image – just set the value of `data-sizes` to `auto`.

The automatic sizes calculation uses the display width of the image.

```html
<img
  loading="lazy"
  src="data:image/svg+xml, ..."
  data-srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  data-sizes="auto"
>
```

When calling [`lazyLoad`](/api/lazy-load), the library automatically calculates the `sizes` attribute for all images with `data-sizes="auto"`.

Alternatively, use the [`autoSizes`](/api/auto-sizes) function to calculate the `sizes` attribute without lazy loading.

To do so, import the [`autoSizes`](/api/auto-sizes) function from the library and call it:

```ts
import { autoSizes } from 'unlazy'

// Automatically calculate the sizes attribute for all `img[data-sizes="auto"], source[data-sizes="auto"]` images, without lazy loading them
autoSizes()
```

## Custom Selectors

You can customize the CSS selectors to target specific images by passing a CSS selector, a DOM element, a list of DOM elements, or an array of DOM elements to [`lazyLoad`](/api/lazy-load) and [`autoSizes`](/api/auto-sizes).

For example, if you want to target images with a `data-custom-lazy` attribute, you can set the selector to `img[data-custom-lazy]`:

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[data-custom-lazy]')
```

::: info
The `loading="lazy"` attribute is still required for the images to be lazy loaded.
:::

## Manually Loading Images

If you want to load an image before it enters the viewport, you can call the [`loadImage`](/api/load-image) function directly. It accepts a `HTMLImageElement` as an argument.

Import the `loadImage` function from the library and call it:

```ts
import { loadImage } from 'unlazy'

const coolImage = document.querySelector('.image-to-load-first')

// Trigger the load before the image enters the viewport
loadImage(coolImage)
```

::: tip
Manually loading images may negatively affect perceived performance by forcing immediate load, even when not visible in the viewport.
:::
