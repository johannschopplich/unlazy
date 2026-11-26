import type { UnLazyImageAttributes, UnLazyImageProps } from './types'

export function resolveImageAttributes(
  {
    src,
    srcSet,
    sources = [],
    autoSizes = false,
    blurhash,
    thumbhash,
    placeholderSrc,
    placeholderSize,
    preload = false,
    loading,
    lazyLoad = true,
  }: UnLazyImageProps,
): UnLazyImageAttributes {
  // An eager image without automatic sizes needs no script to load, so it
  // renders its real sources for the browser's preload scanner.
  const hasRealSources = loading === 'eager' && !autoSizes && lazyLoad
  const isDeferred = !lazyLoad && !preload
  const autoSizesValue = autoSizes ? 'auto' : undefined

  const image: UnLazyImageAttributes['image'] = {
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
  }
  const sourceAttributes = sources.map(source => ({
    type: source.type,
    media: source.media,
    width: source.width,
    height: source.height,
    ...(hasRealSources
      ? { srcset: source.srcSet, sizes: source.sizes }
      : {
          'data-srcset': source.srcSet,
          // A source cannot load before its srcset is set. Keep explicit sizes
          // available both to the temporary picture and to the visible source.
          ...(source.sizes && source.sizes !== 'auto'
            ? { sizes: source.sizes }
            : { 'data-sizes': source.sizes || autoSizesValue }),
        }),
  }))
  const lazyLoadOptions: UnLazyImageAttributes['lazyLoadOptions'] = {
    hash: thumbhash || blurhash,
    hashType: thumbhash ? 'thumbhash' : 'blurhash',
    placeholderSize,
    updateSizesOnResize: autoSizes,
    preload,
    hold: isDeferred,
  }

  return {
    image,
    sources: sourceAttributes,
    lazyLoadOptions,
    loadKey: JSON.stringify([image, sourceAttributes, lazyLoadOptions]),
  }
}
