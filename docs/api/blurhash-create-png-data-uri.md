# `createPngDataUri`

Creates a PNG data URI from a BlurHash string for server-side rendering.

## Example

```ts
import { createPngDataUri } from 'unlazy/blurhash'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngDataUri = createPngDataUri(blurhash, {
  ratio: 16 / 9,
  size: 32
})
```

Use the result as the `src` attribute of an `<img>` element:

```html
<img :src="pngDataUri">
```

## Type Declarations

<<< @/../packages/unlazy/src/blurhash.ts#BlurHashOptions{ts}

<<< @/../packages/unlazy/src/blurhash.ts#createPngDataUri{ts}
