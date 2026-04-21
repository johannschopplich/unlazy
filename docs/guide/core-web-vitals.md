# Core Web Vitals

Lazy loading the wrong image can regress your Core Web Vitals more than it helps. This page documents the patterns that work and the ones that don't, with the exact attributes to set.

## The Golden Rule: Never Lazy-Load the LCP Image

The Largest Contentful Paint (LCP) element – typically the hero image above the fold – must load **eagerly** and with **high priority**. Lazy-loading it measurably regresses LCP and Lighthouse will flag it.

::: tip
**Rule of thumb:** any image that is visible in the initial viewport on a typical screen is a candidate for eager loading.
:::

## Eager, Above-the-Fold Images

Write your hero image like this:

```html
<img
  loading="eager"
  data-src="hero.jpg"
  width="1600"
  height="900"
  alt="Sunset over the ocean"
>
```

unlazy detects `loading="eager"` and routes the image through the priority path: the real source is swapped in immediately and `fetchpriority="high"` is applied. See [`lazyLoad` → How It Works](/api/lazy-load#how-it-works) for the exact behavior.

Framework integrations expose a `priority` prop that sets `loading="eager"` for you.

## Lazy, Below-the-Fold Images

For everything else, stay with native lazy loading:

```html
<img
  loading="lazy"
  data-src="article.jpg"
  width="1200"
  height="675"
  alt="Architectural diagram"
>
```

Never combine `loading="lazy"` with `fetchpriority="high"` – the browser still waits for the image to approach the viewport before fetching, so the priority hint has no effect. Lighthouse flags this combination as a misconfiguration.

## `decoding` – Leave It Alone

unlazy never sets `decoding` for you. The real-world impact on CWV is minor, and `decoding="async"` on a priority image can actually hurt LCP by preventing the synchronous paint path. If you have a specific reason to set it, do so on the `<img>` tag directly.

## Dev-Mode LCP Warning

During development, unlazy watches for the LCP element. If the LCP turns out to be an image still marked `loading="lazy"` or still holding a `data-src` attribute, unlazy logs a console warning:

```
[unlazy] LCP element is configured for lazy loading.
Set `loading="eager"` to improve Largest Contentful Paint.
```

The warning can be stripped from production builds via the [`__UNLAZY_LOGGING__`](/advanced/build-flags#disable-client-logging) build flag.

## INP: Don't Lazy-Load Interactive Regions

If an image sits inside an interactive region (a button, a menu trigger, a card that becomes clickable only after hydration), do not lazy-load it. The image not being in the DOM when the user taps will inflate Interaction to Next Paint (INP).

Same rule: mark it `loading="eager"`.

## Responsive Images

Always set `width` and `height` on every `<img>`. Without them browsers can't reserve space and Cumulative Layout Shift (CLS) suffers.

Modern browsers derive `aspect-ratio` from these attributes, so setting both is effectively free for layout stability.

For multi-source responsive images, combine `<picture>` with `data-srcset`:

```html
<picture>
  <source type="image/avif" data-srcset="photo.avif">
  <source type="image/webp" data-srcset="photo.webp">
  <img
    loading="lazy"
    data-src="photo.jpg"
    data-sizes="auto"
    width="1200"
    height="800"
    alt="Mountain peak at dawn"
  >
</picture>
```
