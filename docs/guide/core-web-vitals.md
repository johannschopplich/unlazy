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

The image swaps synchronously, the viewport wait is skipped, and `fetchpriority="high"` is added if no `fetchpriority` is already set – an explicit `fetchpriority="low"` on a carousel slide is preserved. An image with a `data-src` or `data-srcset` but no `loading` attribute takes the eager path too. Eager images get no hash placeholder: the real image would replace it before it is painted. See [`lazyLoad` → How It Works](/api/lazy-load#how-it-works) for the exact behavior.

A URL in `data-src` or `data-srcset` waits for `lazyLoad` to run, so the browser's preload scanner cannot find it. For the LCP image, write `src` and `srcset` into the markup instead, with an explicit `sizes` and `fetchpriority="high"`. The default selector skips an image without `data-src` and `data-srcset`.

The [framework components](/integrations/) do this for you: with `loading="eager"` and without `autoSizes`, `UnLazyImage` renders the real `src`, `srcset`, and `sources`, and no placeholder. Pass `sizes` instead of `autoSizes` for the LCP image to keep it on this path, and set `fetchpriority="high"` yourself.

## The Lazy LCP Anti-Pattern

Lazy-loading the LCP image regresses LCP measurably. web.dev [reports](https://web.dev/articles/lcp-lazy-loading) +273ms median and 13–15% slower on WordPress archive pages, and Lighthouse flags it in the [LCP request discovery](https://developer.chrome.com/docs/performance/insights/lcp-discovery) insight.

The fix is the eager path above. `fetchpriority="high"` won't rescue a `loading="lazy"` image either – the fetch is deferred until viewport intersection, so the priority hint has nothing to act on.

## Dev-Mode LCP Warning

unlazy attaches a [`PerformanceObserver`](https://developer.mozilla.org/en-US/docs/Web/API/LargestContentfulPaint) for `largest-contentful-paint` entries where your bundler resolves the [`development` export condition](/advanced/build-flags#disable-client-logging). When the LCP element is an `<img>` still marked `loading="lazy"` or still holding a `data-src` / `data-srcset`, unlazy logs:

```
[unlazy] LCP element is configured for lazy loading.
Set `loading="eager"` to improve Largest Contentful Paint.
```

Production builds drop the warning. To drop it from development builds as well, set [`__UNLAZY_LOGGING__`](/advanced/build-flags#disable-client-logging) to `false`.

## Browser Support

`loading="lazy"` is [Baseline Widely Available](https://caniuse.com/loading-lazy-attr), so unlazy ships no fallback for browsers without it. Browsers without `fetchpriority` ignore the hint and still get the eager swap; browsers without the `LargestContentfulPaint` API skip the dev warning.

## What unlazy Does Not Set

- **`decoding`** – if you need it, set it on the `<img>` directly.
- **`width` / `height`** – set both on every `<img>`. Browsers [derive `aspect-ratio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img) from the pair and reserve layout space, which prevents Cumulative Layout Shift. Without them, set the CSS `aspect-ratio` property to the width / height of the full-quality image to reserve the space.
- **`alt`** – unlazy preserves whatever you pass.
