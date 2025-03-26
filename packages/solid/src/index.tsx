import type { JSX } from 'solid-js'
import type { UnLazyLoadOptions } from 'unlazy'
import { createEffect, createSignal, onCleanup, splitProps } from 'solid-js'
import { lazyLoad } from 'unlazy'

interface Props
  extends JSX.ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /** Image source URL to be lazy-loaded. */
  src?: JSX.ImgHTMLAttributes<HTMLImageElement>['src']
  /** Image source set to be lazy-loaded. */
  srcSet?: JSX.ImgHTMLAttributes<HTMLImageElement>['srcSet']
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
   * Allows to specify the loading strategy of the image.
   * @default 'lazy'
   */
  loading?: JSX.ImgHTMLAttributes<HTMLImageElement>['loading']
}

export function UnLazyImage(props: Props) {
  const [local, rest] = splitProps(
    props,
    ['src', 'srcSet', 'autoSizes', 'blurhash', 'thumbhash', 'placeholderSrc', 'placeholderSize', 'loading'],
  )

  const [target, setTarget] = createSignal<HTMLImageElement>()

  createEffect(() => {
    const el = target()
    if (!el)
      return

    const cleanup = lazyLoad(el, {
      hash: local.thumbhash || local.blurhash,
      hashType: local.thumbhash ? 'thumbhash' : 'blurhash',
      placeholderSize: local.placeholderSize,
    })

    onCleanup(() => {
      cleanup()
    })
  })

  return (
    <img
      ref={setTarget}
      src={local.placeholderSrc}
      data-src={local.src}
      data-srcset={local.srcSet}
      data-sizes={local.autoSizes ? 'auto' : undefined}
      loading={local.loading || 'lazy'}
      {...rest}
    />
  )
}
