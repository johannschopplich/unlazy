// eslint-disable-next-line unused-imports/no-unused-imports
import { template } from 'solid-js/web'
import { createEffect, onCleanup, onMount } from 'solid-js'
import type { JSX } from 'solid-js'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

interface Props
  extends JSX.ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'placeholderSize'> {
  /**
   * A flag to indicate whether the sizes attribute should be automatically calculated.
   * @default false
   */
  autoSizes?: boolean
  /** A BlurHash string representing the blurry placeholder image. */
  blurhash?: string
  /** A ThumbHash string representing the blurry placeholder image. */
  thumbhash?: string
  /**
   * A flag to indicate whether the image should be loaded immediately.
   * @default false
   */
  immediate?: boolean
}

export function UnLazyImage(props: Props) {
  let target: HTMLImageElement

  onMount(() => {
    if (!target)
      return

    createEffect(() => {
      const cleanup = lazyLoad(target, {
        hash: props.thumbhash || props.blurhash,
        hashType: props.thumbhash ? 'thumbhash' : 'blurhash',
        placeholderSize: props.placeholderSize,
        immediate: props.immediate,
      })

      onCleanup(() => {
        cleanup()
      })
    })
  })

  return (
    <img
      ref={el => (target = el)}
      data-sizes={props.autoSizes ? 'auto' : undefined}
      loading="lazy"
      {...props}
    />
  )
}
