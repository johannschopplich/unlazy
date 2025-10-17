# BlurHash

unlazy supports client-side and server-side (SSR) decoding of [BlurHash](https://blurha.sh) strings. This allows you to use BlurHash placeholders for images that are not yet loaded.

A BlurHash is a compact string representation that encodes an image placeholder. It provides more detail than a solid color while remaining small enough to embed directly in HTML or JSON responses.

## Client-Side Decoding

### `data-blurhash` Attribute

By default, unlazy will decode BlurHash strings on the client-side automatically when a `data-blurhash` is present on a `<img>` tag.

```html
<img
  data-src="image.jpg"
  data-blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
>
```

### `hash` Option

If you are initializing unlazy for single images, i.e. in a frontend framework component of your choice, you can pass a custom `hash` string to the [`lazyLoad`](/api/lazy-load) function. It has higher priority than the `data-blurhash` attribute.

```ts
import { lazyLoad } from 'unlazy'

const image = document.querySelector('#image')

lazyLoad(image, {
  hash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
  hashType: 'blurhash'
})
```

::: info
The `hashType` is optional and defaults to `blurhash`.
:::

### Disabling BlurHash Decoding

To disable BlurHash decoding altogether, pass `false` to the `hash` option.

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[loading="lazy"]', {
  hash: false
})
```

::: info
This will also disable [ThumbHash](/placeholders/thumbhash) decoding.
:::

## Server-Side Decoding

If you are using a server-side framework, you can use the [`createPngDataUri`](/api/blurhash-create-png-data-uri) function to create a PNG data URI from a BlurHash string. The resulting data URI can then be used as the `src` attribute of an image.

```ts
import { createPngDataUri } from 'unlazy/blurhash'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngDataUri = createPngDataUri(blurhash)
```

For a complete list of options, see the [`createPngDataUri` API documentation](/api/blurhash-create-png-data-uri).
