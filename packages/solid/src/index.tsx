import type { JSX } from 'solid-js'
import type { UnLazyLoadOptions, UnLazySource } from 'unlazy'
import { createEffect, createSignal, For, onCleanup, Show, splitProps } from 'solid-js'
import { autoSizes as _autoSizes, lazyLoad, triggerLoad } from 'unlazy'

interface Props
  extends JSX.ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /** Image source URL to be lazy-loaded. */
  src?: JSX.ImgHTMLAttributes<HTMLImageElement>['src']
  /** Image source set to be lazy-loaded. */
  srcSet?: JSX.ImgHTMLAttributes<HTMLImageElement>['srcSet']
  /** Image source URLs for different resolutions. This will render the `<picture>` element instead of `<img>`. */
  sources?: UnLazySource[]
  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  autoSizes?: boolean
  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string
  /** A ThumbHash string representing the blurry placeholder image. */
  thumbhash?: string
  /** Optional image source URL for a custom placeholder image. Will be ignored if a BlurHash or ThumbHash is provided. */
  placeholderSrc?: string
  /**
   * A flag to indicate whether the image should be preloaded, even if it is not in the viewport yet.
   * @default false
   */
  preload?: boolean
  /**
   * Allows to specify the loading strategy of the image.
   * @default 'lazy'
   */
  loading?: JSX.ImgHTMLAttributes<HTMLImageElement>['loading']
  /** A callback function to run when the image is loaded. */
  onImageLoad?: (image: HTMLImageElement) => void
  /** A callback function to run when the image fails to load. */
  onImageError?: (image: HTMLImageElement, error: Event) => void
}

export function UnLazyImage(props: Props) {
  const [local, rest] = splitProps(
    props,
    ['src', 'srcSet', 'sources', 'autoSizes', 'blurhash', 'thumbhash', 'placeholderSrc', 'placeholderSize', 'preload', 'loading', 'onImageLoad', 'onImageError'],
  )

  const [target, setTarget] = createSignal<HTMLImageElement>()

  createEffect(() => {
    const el = target()
    if (!el)
      return

    if (local.preload) {
      const cleanupSizes = local.autoSizes
        ? _autoSizes(el, { updateOnResize: true })
        : undefined
      const cleanupLoad = triggerLoad(el, {
        onImageLoad: local.onImageLoad,
        onImageError: local.onImageError,
      })
      onCleanup(() => {
        cleanupSizes?.()
        cleanupLoad()
      })
      return
    }

    const cleanup = lazyLoad(el, {
      hash: local.thumbhash || local.blurhash,
      hashType: local.thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize: local.placeholderSize,
      updateSizesOnResize: local.autoSizes,
      onImageLoad: local.onImageLoad,
      onImageError: local.onImageError,
    })
    onCleanup(() => {
      cleanup()
    })
  })

  return (
    <Show
      when={local.sources?.length}
      fallback={(
        <img
          ref={setTarget}
          src={local.placeholderSrc}
          data-src={local.src}
          data-srcset={local.srcSet}
          data-sizes={local.autoSizes ? 'auto' : undefined}
          loading={local.loading || 'lazy'}
          {...rest}
        />
      )}
    >
      <picture>
        <For each={local.sources}>
          {source => (
            <source
              type={source.type}
              media={source.media}
              width={source.width}
              height={source.height}
              data-srcset={source.srcSet}
              data-sizes={source.sizes || (local.autoSizes ? 'auto' : undefined)}
            />
          )}
        </For>
        <img
          ref={setTarget}
          src={local.placeholderSrc}
          data-src={local.src}
          data-srcset={local.srcSet}
          data-sizes={local.autoSizes ? 'auto' : undefined}
          loading={local.loading || 'lazy'}
          {...rest}
        />
      </picture>
    </Show>
  )
}
