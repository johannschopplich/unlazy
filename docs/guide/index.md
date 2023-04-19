# What Is unlazy?

unlazy is a universal lazy loading library leveraging native browser APIs. It's intended to be used with the `loading="lazy"` attribute alongside (blurry) placeholder images or with a [BlurHash](https://blurha.sh).

::: info
Although the `loading="lazy"` attribute is supported in all major browsers, it is only available in Safari 16.4 (released March 2023) and later versions by default. It is important to consider this limitation when using unlazy for your project, as it might impact the user experience for visitors using older Safari versions or other unsupported browsers.
:::

## How It Works

unlazy offers a tailored solution for those who prefer to use blurry placeholders for image loading. This approach prioritizes the initial rendering of the page and improves the perceived performance for users, especially when the connection is slow or unstable.

The library's implementation ensures that search engines can index the full-quality images by detecting whether the visitor is a bot or a crawler. It processes all images with a `loading="lazy"` attribute, calculates the sizes attribute if necessary, and checks if the image has a blurry placeholder (given the `data-srcset` attribute).

It ensures that images are initially rendered with blurry placeholders, giving the user an impression of the page layout and content. As the images enter the viewport, they are replaced with the full-quality versions, providing a smoother experience.

unlazy intends to offer a good balance between performance and user experience and works well for specific use cases where blurry placeholders are the preferred method for image loading.

## Getting Started

Head over to the [installation guide](/guide/installation) to learn how to install unlazy in your project. After that, you can check out the [usage guide](/guide/usage) and may take a look at the [API reference](/api).

If your project is using [BlurHash](https://blurha.sh), you can check out the [BlurHash guide](/guide/blurhash) to learn how to use it with unlazy.
