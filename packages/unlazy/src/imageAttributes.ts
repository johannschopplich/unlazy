import type { ResolveImageAttributesOptions, UnLazyImageAttributes } from './types'

/**
 * Resolves the attributes of an `UnLazyImage` component's `<img>` and
 * `<source>` elements, and the hash its placeholder decodes from.
 */
export function resolveImageAttributes(
  {
    src,
    srcSet,
    sources = [],
    autoSizes = false,
    blurhash,
    thumbhash,
    placeholderSrc,
    preload = false,
    loading,
    lazyLoad = true,
  }: ResolveImageAttributesOptions,
): UnLazyImageAttributes {
  // An eager image without automatic sizes needs no script to load, so it
  // renders its real sources for the browser's preload scanner.
  const hasRealSources = loading === 'eager' && !autoSizes && lazyLoad
  const isDeferred = !lazyLoad && !preload
  const autoSizesValue = autoSizes ? 'auto' : undefined

  return {
    hasRealSources,
    image: {
      ...(hasRealSources
        ? { src, srcset: srcSet }
        : {
            // Some frameworks, such as Svelte, remove a spread attribute whose
            // value is `undefined` on every update, which would drop the `src`
            // that `lazyLoad` swapped in.
            ...(placeholderSrc !== undefined && { src: placeholderSrc }),
            'data-src': src,
            'data-srcset': srcSet,
            'data-sizes': autoSizesValue,
          }),
      loading: loading || (isDeferred ? 'eager' : 'lazy'),
    },
    sources: sources.map(source => ({
      type: source.type,
      media: source.media,
      width: source.width,
      height: source.height,
      ...(hasRealSources
        ? { srcset: source.srcSet, sizes: source.sizes }
        : { 'data-srcset': source.srcSet, 'data-sizes': source.sizes || autoSizesValue }),
    })),
    sourcesKey: JSON.stringify(sources),
    hash: thumbhash || blurhash,
    hashType: thumbhash ? 'thumbhash' : 'blurhash',
  }
}
