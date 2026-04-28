# `autoSizes`

The `autoSizes` function resolves `data-sizes="auto"` to a numeric pixel width based on the rendered display size. It works on standalone `<img>` elements, on `<source>` siblings inside a `<picture>`, or both.

When called with an `<img>` inside a `<picture>`, `autoSizes` walks to every `<source data-sizes="auto">` sibling and resolves them in the same call. `<source>` elements have no layout box of their own, so the rendered `<img>` width is used instead.

To lazy load images, refer to the [`lazyLoad`](/api/lazy-load) method.

## Options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `updateOnResize` | `boolean` | `false` | Install a debounced `ResizeObserver` that re-resolves `data-sizes="auto"` on viewport changes. The returned disposer disconnects it. |

## Return Value

`autoSizes` returns a disposer. When called with `updateOnResize: false` (or no options), the disposer is a no-op. With `updateOnResize: true`, calling it disconnects every `ResizeObserver` created by that call:

```ts
import { autoSizes } from 'unlazy'

const dispose = autoSizes('img[data-sizes="auto"]', { updateOnResize: true })

// Later, when cleaning up
dispose()
```

## Type Declarations

<<< @/../packages/core/src/types.ts#AutoSizesOptions{ts}

<<< @/../packages/core/src/lazyLoad.ts#autoSizes{ts}

## Example

```html
<img
  srcset="image-320w.jpg 320w, image-640w.jpg 640w"
  data-sizes="auto"
>
```

```ts
import { autoSizes } from 'unlazy'

// One-shot resolve
autoSizes()

// Or: resolve and keep tracking on resize
const dispose = autoSizes(undefined, { updateOnResize: true })
```

::: tip
For most users, calling [`lazyLoad`](/api/lazy-load) with `updateSizesOnResize: true` is the simpler path – it delegates to `autoSizes` internally and bundles the disposer into the same cleanup callback.
:::
