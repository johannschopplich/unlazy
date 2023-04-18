---
layout: home
sidebar: false

title: unlazy
titleTemplate: Universal lazy loading library

hero:
  name: unlazy
  text: Universal lazy loading library for placeholder images
  tagline: Framework-agnostic, leveraging native browser APIs
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
    details: Utilizes the <code>loading="lazy"</code> attribute. Modern browsers only.
  - title: Framework-Agnostic
    icon: <span class="i-carbon:layers"></span>
    details: Works with any framework or no framework at all.
  - title: SSR & Client-Side BlurHash Decoding
    icon: <span class="i-carbon:matrix"></span>
    details: Decodes BlurHash strings on the server or in the browser.
  - title: BlurHash Aspect Ratio
    icon: <span class="i-carbon:fit-to-screen"></span>
    details: Calculates the best aspect ratio for the placeholder image.
  - title: Auto-Sizing
    icon: <span class="i-carbon:fit-to-width"></span>
    details: Automatically calculates the `sizes` attribute for optimal performance.
  - title: SEO-friendly
    icon: <span class="i-carbon:zoom-area"></span>
    details: Detects search engine bots and preloads all images.
  - title: Image and Picture Tag
    icon: <span class="i-carbon:image-copy"></span>
    details: Supports multiple image formats. Works with the <code>picture</code> tag.
  - title: Auto-Initialize Without a Build Step
    icon: <span class="i-carbon:delivery"></span>
    details: Use the <code>init</code> attribute to initialize in the IIFE build.
---
