# `createPngDataUri`

Creates a PNG data URI from a ThumbHash string for server-side rendering.

The hash can be base64 or base64url encoded. The function uses the `thumbhash` library for decoding, which determines the aspect ratio from the hash itself.

## Example

```ts
import { createPngDataUri } from 'unlazy/thumbhash'

const thumbhash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
const pngDataUri = createPngDataUri(thumbhash)
```

Use the result as the `src` attribute of an `<img>` element:

```html
<img :src="pngDataUri">
```

## Type Declarations

```ts
function createPngDataUri(hash: string): string
```
