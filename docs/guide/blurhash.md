# BlurHash

unlazy supports server-side and client-side [BlurHash](https://blurha.sh/) decoding. This allows you to use BlurHash placeholders for images that are not yet loaded. The BlurHash placeholder is a low-resolution, low-quality representation of the image. It is encoded as a string and can be decoded to a PNG image.

## Client-Side BlurHash Decoding

By default, unlazy will try to decode BlurHash strings on the client-side. This is the recommended approach as it allows you to use BlurHash placeholders for images that are not yet loaded.

Decoding is automatically enabled when a `data-blurhash` is present on an image.

```html
<img
  data-src="image.jpg"
  data-blurhash="LKO2:N%2Tw=w]~RBVZRi};RPxuwH"
>
```

If you are initializing unlazy for single images, i.e. in a frontend framework component of your choice, you can pass a custom `blurhash` string to the [`lazyLoad`](/api/lazy-load) function.

```ts
import { lazyLoad } from 'unlazy'

const image = document.querySelector('#image')

lazyLoad(image, {
  blurhash: 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH',
})
```

To disable blurhash decoding, pass `false` to the `blurhash` option.

```ts
import { lazyLoad } from 'unlazy'

lazyLoad('img[loading="lazy"]', {
  blurhash: false,
})
```

## Server-Side BlurHash Decoding

If you are using a server-side framework, you can generate SSR-ready BlurHash placeholders.

```ts
import { createPngDataUriFromBlurHash } from 'unlazy'

const blurhash = 'LKO2:N%2Tw=w]~RBVZRi};RPxuwH'
const pngDataUri = createPngDataUriFromBlurHash(blurhash)
```

The `pngDataUri` can then be used as the `src` attribute of an image.

For a complete list of options, see the [`createPngDataUriFromBlurHash` API documentation](/api/create-png-data-uri-from-blur-hash).
