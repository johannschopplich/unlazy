# What Is unlazy?

unlazy is a universal lazy loading library leveraging native browser APIs. It's intended to be used with the (blurry) placeholder images or a [BlurHash](/placeholders/blurhash) alongside the native `loading="lazy"` attribute.

Images are initially rendered with blurry placeholders, giving the user an impression of the page layout and content. As the images enter the viewport, they are replaced with the full-quality versions, providing a smoother experience. This approach prioritizes the initial rendering of the page and improves the perceived performance for users, especially when the connection is slow or unstable.

::: info
Although the `loading="lazy"` attribute is supported in all major browsers, it is only available in Safari 16.4 (released March 2023) and later versions by default. It is important to consider this limitation when using unlazy for your project, as it might impact the user experience for visitors using older Safari versions or other unsupported browsers.
:::

## How It Works

unlazy processes all images with a `loading="lazy"` attribute, calculates the sizes attribute if necessary, and checks if the image has a blurry placeholder (given that either a `data-src` or `data-srcset` attribute is present).

unlazy intends to offer a good balance between performance and user experience and works well for specific use cases where blurry placeholders are the preferred method for image loading.

## SEO

unlazy ensures that search engines can index the full-quality images by detecting whether the visitor is a bot or a crawler.

## Getting Started

Head over to the [installation guide](/guide/installation) to learn how to install unlazy in your project. After that, you can check out the [usage guide](/guide/usage) and may take a look at the [API reference](/api/).

If your project is using [BlurHash](https://blurha.sh), you can check out the [BlurHash guide](/placeholders/blurhash) to learn how to use it with unlazy.

The shiny new [ThumbHash](https://github.com/evanw/thumbhash) by Evan Wallace is also supported. You can check out the [ThumbHash guide](/placeholders/thumbhash) to learn how to use it with unlazy.
