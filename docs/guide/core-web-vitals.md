# Core Web Vitals

unlazy is opinionated about two things that touch Core Web Vitals: the LCP image's loading mode and a development-mode warning when you get it wrong. Everything else – `decoding`, `width`/`height`, `alt` – stays your responsibility.

## The Eager Path

Mark above-the-fold images `loading="eager"` and unlazy routes them through the priority path:

```html
<img
  loading="eager"
  data-src="hero.jpg"
  width="1600"
  height="900"
  alt="Sunset over the ocean"
>
```

The image swaps synchronously, the viewport wait is skipped, and `fetchpriority="high"` is added if no `fetchpriority` is already set – an explicit `fetchpriority="low"` on a carousel slide is preserved. See [`lazyLoad` → How It Works](/api/lazy-load#how-it-works) for the exact behavior.

## The Lazy LCP Anti-Pattern

Lazy-loading the LCP image regresses LCP measurably. web.dev [reports](https://web.dev/articles/lcp-lazy-loading) +273ms median and 13–15% slower on WordPress archive pages, and Lighthouse flags it with the [`lcp-lazy-loaded`](https://unlighthouse.dev/learn-lighthouse/lcp/lcp-lazy-loaded) audit.

The fix is the eager path above. `fetchpriority="high"` won't rescue a `loading="lazy"` image either – the fetch is deferred until viewport intersection, so the priority hint has nothing to act on.

## Dev-Mode LCP Warning

unlazy attaches a [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint) for `largest-contentful-paint` entries during development. When the LCP element is an `<img>` still marked `loading="lazy"` or still holding a `data-src` / `data-srcset`, unlazy logs:

```
[unlazy] LCP element is configured for lazy loading.
Set `loading="eager"` to improve Largest Contentful Paint.
```

Strip the warning from production builds via the [`__UNLAZY_LOGGING__`](/advanced/build-flags#disable-client-logging) build flag.

## Browser Support

`loading="lazy"` is [Baseline Widely Available](https://caniuse.com/loading-lazy-attr), so unlazy ships no fallback for browsers without it. Browsers without `fetchpriority` ignore the hint and still get the eager swap; browsers without the `LargestContentfulPaint` API skip the dev warning.

## What unlazy Does Not Set

- **`decoding`** – if you need it, set it on the `<img>` directly.
- **`width` / `height`** – set both on every `<img>`. Browsers [derive `aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) from the pair and reserve layout space, which prevents Cumulative Layout Shift. Without them, set the CSS `aspect-ratio` property to the width / height of the full-quality image to reserve the space.
- **`alt`** – unlazy preserves whatever you pass.
