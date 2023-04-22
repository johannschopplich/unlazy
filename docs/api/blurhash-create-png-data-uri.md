# `createPngDataUri`

Especially when using a server-side rendering framework like [Nuxt](https://nuxt.com), you might want to generate the placeholder images for the `src` attribute with SSR. This can be done with the `createPngDataUri` function:

```ts
import { createPngDataUri } from 'unlazy/blurhash'

const pngDataUri = createPngDataUri(blurhash)
```

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
