# BlurHash

unlazy supports client-side [BlurHash](https://blurha.sh/) and server-side (SSR) decoding. This allows you to use BlurHash placeholders for images that are not yet loaded.

A BlurHash placeholder is a low-resolution, low-quality representation of the image, encoded as a string and decodable to a PNG image.

## Client-Side BlurHash Decoding

### `data-blurhash` Attribute

By default, unlazy will decode BlurHash strings on the client-side automatically when a `data-blurhash` is present on a `<img>` tag.

```html
<img
  data-src="image.jpg"
  data-blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
>
```

### `blurhash` Option

If you are initializing unlazy for single images, i.e. in a frontend framework component of your choice, you can pass a custom `blurhash` string to the [`lazyLoad`](/api/lazy-load) function. It has higher priority than the `data-blurhash` attribute.

```ts
import { lazyLoad } from 'unlazy'

const image = document.querySelector('#image')

lazyLoad(image, {
  blurhash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
})
```

### Disabling BlurHash Decoding

To disable blurhash decoding, pass `false` to the `blurhash` option.

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[loading="lazy"]', {
  blurhash: false,
})
```

## Server-Side BlurHash Decoding

If you are using a server-side framework, you can use the [`createPngDataUri`](/api/blurhash-create-png-data-uri) function to create a PNG data URI from a BlurHash string. The resulting data URI can then be used as the `src` attribute of an image.

```ts
import { createPngDataUri } from 'unlazy/blurhash'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngDataUri = createPngDataUri(blurhash)
```

For a complete list of options, see the [`createPngDataUri` API documentation](/api/blurhash-create-png-data-uri).
