# `createPngDataUri`

Especially when using a server-side rendering framework like [Nuxt](https://nuxt.com), you might want to generate the placeholder images for the `src` attribute with SSR. This can be done with the `createPngDataUri` function:

```ts
import { createPngDataUri } from 'unlazy/thumbhash'

const pngDataUri = createPngDataUri(thumbhash)
```

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
