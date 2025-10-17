# `createPngDataUri`

Creates a PNG data URI from a BlurHash string for server-side rendering. This function decodes the BlurHash into RGBA pixel data and encodes it as a base64 PNG data URI.

```ts
import { createPngDataUri } from 'unlazy/blurhash'

const pngDataUri = createPngDataUri(blurhash, {
  ratio: 16 / 9,
  size: 32
})
```

The function uses the `fast-blurhash` library for decoding and generates a compact PNG representation suitable for inlining in HTML.

## Type Declarations

```ts
interface BlurHashOptions {
  /**
   * Aspect ratio (width / height) of the BlurHash image to be decoded.
   *
   * @default 1 (square aspect ratio)
   */
  ratio?: number

  /**
   * The size of the longer edge (width or height) of the BlurHash image to be
   * decoded, depending on the aspect ratio.
   *
   * @default 32
   */
  size?: number
}

function createPngDataUri(
  hash: string,
  options?: BlurhashOptions
): string
```

## Example

```ts
import { createPngDataUri } from 'unlazy/blurhash'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngDataUri = createPngDataUri(blurhash)
```

The `pngDataUri` variable will contain a PNG data URI for the `src` attribute of a `<img>` element.

```html
<img :src="pngDataUri">
```
