# `triggerLoad`

The `triggerLoad` function loads an image right away by swapping its `data-src` and `data-srcset` to `src` and `srcset`. It works on a standalone `<img>` and on an `<img>` inside a `<picture>`.

## Example

```ts
import { triggerLoad } from 'unlazy'

const image = document.querySelector<HTMLImageElement>('.priority-image')!

// Load immediately with callbacks
const cleanup = triggerLoad(image, {
  onImageLoad: img => console.log('Loaded:', img.src),
  onImageError: (img, error) => console.error('Failed to load:', img, error),
})

// Later, cancel the load if it has not completed yet
cleanup()
```

## Type Declarations

<<< @/../packages/unlazy/src/types.ts#TriggerLoadOptions{ts}

<<< @/../packages/unlazy/src/lazyLoad.ts#triggerLoad{ts}

## How It Works

1. Resolves `data-sizes="auto"` to a numeric pixel width on the `<img>` and on every `<source>` of its `<picture>`.
2. Preloads the image in a temporary `<img>` that copies the `referrerpolicy`, `crossorigin`, `fetchpriority`, and `decoding` attributes of the visible one. The matching `referrerpolicy` and `crossorigin` let the browser fetch the image once. For an `<img>` inside a `<picture>`, the temporary image sits in a detached copy of the `<picture>` and fetches the source the browser selects.
3. Once the preload has loaded, sets `loading="eager"` on the visible `<img>`, so an off-screen image loads too, and swaps `data-src` and `data-srcset` – on the `<img>` and on every `<source>` – to their standard counterparts.
4. Invokes the optional `onImageLoad` callback once the visible `<img>` has loaded the new source.
5. If the preload fails, swaps nothing: the placeholder stays, the visible `<img>` gets a `data-error` attribute and a synthetic `error` event, then `onImageError` runs. If the preload loads but the visible `<img>` then fails to load the swapped-in source, it gets `data-error` too, and `onImageError` runs with the `<img>`'s own `error` event. See [Style a Failed Image](/guide/usage#style-a-failed-image).

::: tip
`triggerLoad` is one-shot – it does not install any `ResizeObserver`. For ongoing source-size tracking on responsive `<picture>` layouts, pair it with [`autoSizes`](/api/auto-sizes) and `{ updateOnResize: true }`:

```ts
const cleanupSizes = autoSizes(image, { updateOnResize: true })
const cleanupLoad = triggerLoad(image)

// Later
cleanupSizes()
cleanupLoad()
```
:::
