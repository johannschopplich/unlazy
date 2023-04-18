# How It Works

unlazy offers a tailored solution for those who prefer to use blurry placeholders for image loading. This approach prioritizes the initial rendering of the page and improves the perceived performance for users, especially when the connection is slow or unstable.

The library's implementation ensures that search engines can index the full-quality images by detecting whether the visitor is a bot or a crawler. It processes all images with a `loading="lazy"` attribute, calculates the sizes attribute if necessary, and checks if the image has a blurry placeholder (given the `data-srcset` attribute).

It ensures that images are initially rendered with blurry placeholders, giving the user an impression of the page layout and content. As the images enter the viewport, they are replaced with the full-quality versions, providing a smoother experience.

unlazy intends to offer a good balance between performance and user experience and works well for specific use cases where blurry placeholders are the preferred method for image loading.
