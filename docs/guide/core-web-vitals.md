# Core Web Vitals

unlazy is opinionated about three things that touch Core Web Vitals: the LCP image's loading mode, a development-mode warning when you get it wrong, and rendering the real source for crawlers. Everything else – `decoding`, `width`/`height`, `alt` – stays your responsibility.

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

## Crawlers and Social Previews

Googlebot supports native `loading="lazy"` but [does not scroll the page](https://developers.google.com/search/docs/crawling-indexing/javascript/lazy-loading), and most social scrapers (Slackbot, Twitterbot, facebookexternalhit) don't run JavaScript at all. unlazy detects bot user agents and runs the immediate-swap path so crawlers see the real `src` in the rendered HTML.

## Browser Support

`loading="lazy"` is [Baseline Widely Available](https://caniuse.com/loading-lazy-attr) – v2 drops the legacy IntersectionObserver fallback. `fetchpriority` is [Baseline Newly Available since 2024-10-29](https://web-platform-dx.github.io/web-features-explorer/features/fetch-priority/), so older browsers ignore the hint without breaking the eager swap. The `LargestContentfulPaint` API used by the dev warning is similarly [Baseline Newly Available](https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint); browsers without support silently no-op the warning.

## What unlazy Does Not Set

- **`decoding`** – browsers handle decoding well by default; `decoding="async"` is no longer the LCP risk older posts suggest. If you have a reason to set it, do so on the `<img>` directly.
- **`width` / `height`** – set both on every `<img>`. Browsers [derive `aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) from the pair and reserve layout space, which prevents Cumulative Layout Shift.
- **`alt`** – your call. unlazy preserves whatever you pass.
