# `createPngDataUri`

Creates a PNG data URI from a ThumbHash string for server-side rendering. This function decodes the base64-encoded ThumbHash into RGBA pixel data and encodes it as a base64 PNG data URI.

```ts
import { createPngDataUri } from 'unlazy/thumbhash'

const pngDataUri = createPngDataUri(thumbhash)
```

The function handles base64-url encoding by converting `-` to `+` and `_` to `/` before decoding. It uses the `thumbhash` library for decoding, which automatically determines the aspect ratio from the hash itself.

## Type Declarations

```ts
function createPngDataUri(hash: string): string
```

## Example

```ts
import { createPngDataUri } from 'unlazy/thumbhash'

const thumbhash = '1QcSHQRnh493V4dIh4eXh1h4kJUI'
const pngDataUri = createPngDataUri(thumbhash)
```

The `pngDataUri` variable will contain a PNG data URI for the `src` attribute of a `<img>` element.

```html
<img :src="pngDataUri">
```
