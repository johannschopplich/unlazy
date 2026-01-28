# `createPlaceholderFromHash`

Generates a PNG data URI placeholder from a BlurHash or ThumbHash string. This function is used internally by [`lazyLoad`](/api/lazy-load) but can also be called directly for custom implementations.

## Type Declarations

<<< @/../packages/core/src/lazyLoad.ts#createPlaceholderFromHash{ts}

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `image` | `HTMLImageElement` | - | If provided, extracts hash from `data-blurhash` or `data-thumbhash` and calculates ratio from element dimensions |
| `hash` | `string` | - | Hash string to decode. Takes precedence over `image` attributes |
| `hashType` | `'blurhash' \| 'thumbhash'` | `'blurhash'` | Hash format. Auto-detected when `image` is provided |
| `size` | `number` | `32` | Size of the longer edge for BlurHash decoding. Ignored for ThumbHash |
| `ratio` | `number` | - | Aspect ratio (width / height) for BlurHash. Auto-calculated from `image` if provided |

::: info
For BlurHash, set explicit `width` and `height` attributes on images. See [placeholders guide](/guide/placeholders#using-data-attributes) for details.
:::

## Return Value

Returns a PNG data URI string if the hash is successfully decoded, or `undefined` if:
- No hash is provided
- The hash decoding fails
- The required decoding library is not available

## Examples

Using with a hash string:

```ts
import { createPlaceholderFromHash } from 'unlazy'

const placeholder = createPlaceholderFromHash({
  hash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
  hashType: 'blurhash',
  size: 32,
  ratio: 16 / 9
})
```

Using with an image element:

```ts
import { createPlaceholderFromHash } from 'unlazy'

const img = document.querySelector('img')
const placeholder = createPlaceholderFromHash({
  image: img
})

if (placeholder) {
  img.src = placeholder
}
```

```html
<img
  width="800"
  height="600"
  data-blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
>
```

::: tip
For server-side rendering, use the specialized functions instead:
- [`createPngDataUri`](/api/blurhash-create-png-data-uri) from `unlazy/blurhash`
- [`createPngDataUri`](/api/thumbhash-create-png-data-uri) from `unlazy/thumbhash`
:::
