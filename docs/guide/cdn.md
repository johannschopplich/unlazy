# Without a Build Step

unlazy runs from a CDN without a build step, which suits prototypes and projects without a bundler.

| Build | File | When to Use |
| --- | --- | --- |
| Standard Global | <CdnLink name="unlazy.iife.js" /> | SSR hash decoding, exposes `UnLazy` global |
| Standard ESM | <CdnLink name="unlazy.js" /> | SSR hash decoding, `<script type="module">` |
| With Hashing Global | <CdnLink name="unlazy.with-hashing.iife.js" /> | Client-side hash decoding |
| With Hashing ESM | <CdnLink name="unlazy.with-hashing.js" /> | Client-side hash decoding, ESM |

Use the standard builds if you decode hashes on the server (SSR), and the `with-hashing` builds only if you need client-side hash decoding.

## Auto-Initialization

With a global build, add the `init` attribute to call `lazyLoad()` once when the script executes:

```html
<script src="https://unpkg.com/unlazy" defer init></script>
```

- The `defer` attribute makes the script execute after HTML content is parsed.
- The `init` attribute processes every image the [default selector](/api/lazy-load) matches at that moment.

::: info
The short CDN URLs are meant for prototyping. For production, use a fully resolved URL to avoid redirect costs, such as <CdnLink name="unlazy.iife.js" />.
:::

## Manual Initialization

If you don't want to auto-initialize the library, remove the `init` attribute and move the scripts to the end of the `<body>` tag:

```html
<script src="https://unpkg.com/unlazy"></script>
<script>
  UnLazy.lazyLoad()
</script>
```

The `init` attribute has no effect on the ESM builds. Import the functions in a module script instead:

```html
<script type="module">
  import { lazyLoad } from 'https://unpkg.com/unlazy/dist/unlazy.js'

  lazyLoad()
</script>
```
