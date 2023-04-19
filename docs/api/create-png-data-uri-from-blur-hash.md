# `createPngDataUriFromBlurHash`

Especially when using a server-side rendering framework like [Nuxt](https://nuxt.com), you might want to generate the placeholder images for the `src` attribute with SSR. This can be done with the `createPngDataUriFromBlurHash` function.

## Type Declarations

```ts
type BlurhashOptions = {
  /**
   * Aspect ratio (width / height) of the decoded BlurHash image.
   *
   * @default 1 (square aspect ratio)
   */
  ratio?: number
} & Pick<UnLazyLoadOptions, 'blurhashSize'>

function createPngDataUriFromBlurHash(
  hash: string,
  options?: BlurhashOptions
): string
```

## Example

```ts
import { createPngDataUriFromBlurHash } from 'unlazy'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngDataUri = createPngDataUriFromBlurHash(blurhash)
```

The `pngDataUri` variable will contain a PNG data URI for the `src` attribute of a `<img>` element.

```html
<img src="data:image/png;base64, ...">
```
