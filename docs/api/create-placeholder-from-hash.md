# `createPlaceholderFromHash`

Generates a PNG data URI placeholder from a BlurHash or ThumbHash string. This function is used internally by [`lazyLoad`](/api/lazy-load) but can also be called directly for custom implementations.

## Type Declarations

<<< @/../packages/core/src/lazyLoad.ts#createPlaceholderFromHash{ts}

## Parameters

The function accepts an options object with the following properties:

- `image`: If provided, the function extracts the hash from `data-blurhash` or `data-thumbhash` attributes and calculates the aspect ratio from the element's dimensions
- `hash`: The hash string to decode. If both `image` and `hash` are provided, `hash` takes precedence
- `hashType`: Specifies whether the hash is a `blurhash` or `thumbhash`. Default is `blurhash`. If `image` is provided, the type is determined from the presence of `data-blurhash` or `data-thumbhash` attributes
- `size`: The size of the longer edge for BlurHash decoding. Default is `32`. This parameter is ignored for ThumbHash
- `ratio`: The aspect ratio (width divided by height) for BlurHash. If `image` is provided, this is calculated automatically using: `(width || offsetWidth || size) / (height || offsetHeight || size)`. For optimal performance, set explicit `width` and `height` HTML attributes to avoid falling back to rendered dimensions

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
<!-- Ensure the image has width and height attributes for optimal performance -->
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
