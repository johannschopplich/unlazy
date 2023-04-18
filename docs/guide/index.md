# What Is unlazy?

unlazy is a universal lazy loading library leveraging native browser APIs. It's intended to be used with the `loading="lazy"` attribute alongside (blurry) placeholder images or with a [BlurHash](https://blurha.sh).

::: info
Although the `loading="lazy"` attribute is supported in all major browsers, it is only available in Safari 16.4 (released March 2023) and later versions by default. It is important to consider this limitation when using unlazy for your project, as it might impact the user experience for visitors using older Safari versions or other unsupported browsers.
:::
