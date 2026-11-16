---
layout: home
sidebar: false

title: unlazy
titleTemplate: Native image lazy loading

hero:
  name: unlazy
  text: Native image lazy loading with hash placeholders
  tagline: BlurHash and ThumbHash for vanilla JS, Vue, React, Svelte, Solid and Nuxt
  image:
    src: /logo-shadow.svg
    alt: unlazy
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: API
      link: /api/
    - theme: alt
      text: View on GitHub
      link: https://github.com/johannschopplich/unlazy

features:
  - title: Native Lazy Loading
    icon: <span class="i-carbon:bring-forward"></span>
    details: Leverages the <code>loading="lazy"</code> attribute. Modern browsers only.
    link: /guide/
    linkText: Learn more
  - title: Framework-Agnostic
    icon: <span class="i-carbon:layers"></span>
    details: Works with any framework or none. Integrations for Vue, React, Solid, Svelte, and Nuxt.
    link: /integrations/
    linkText: View integrations
  - title: BlurHash and ThumbHash
    icon: <span class="i-carbon:data-blob"></span>
    details: Compact hash strings decode into blurry placeholder images.
    link: /guide/placeholders
    linkText: Placeholder guide
  - title: SSR and Client-Side Decoding
    icon: <span class="i-carbon:fit-to-screen"></span>
    details: Decode hashes on the server during SSR or in the browser at runtime.
    link: /guide/placeholders#decode-in-the-browser-or-on-the-server
    linkText: Decoding strategies
  - title: Auto-Sizing
    icon: <span class="i-carbon:fit-to-width"></span>
    details: Calculates the <code>sizes</code> attribute automatically from display width.
    link: /guide/usage#calculate-the-sizes-attribute-automatically
    linkText: Auto sizes
  - title: SEO-Friendly
    icon: <span class="i-carbon:zoom-area"></span>
    details: Detects bots and crawlers, loading full images immediately for indexing.
    link: /guide/seo-considerations
    linkText: SEO guide
  - title: Image and Picture Tags
    icon: <span class="i-carbon:image-copy"></span>
    details: Full support for <code>&lt;img&gt;</code> and <code>&lt;picture&gt;</code> with multiple sources.
    link: /guide/usage
    linkText: Usage examples
  - title: CDN Auto-Initialize
    icon: <span class="i-carbon:delivery"></span>
    details: Use the <code>init</code> attribute in IIFE builds. No bundler required.
    link: /guide/cdn#auto-initialization
    linkText: CDN usage
---
