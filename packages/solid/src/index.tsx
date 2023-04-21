// eslint-disable-next-line unused-imports/no-unused-imports
import { template } from 'solid-js/web'
import { createEffect, onCleanup, onMount } from 'solid-js'
import type { JSX } from 'solid-js'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'

interface Props
  extends JSX.ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'blurhashSize'> {
  autoSizes?: boolean
  blurhash?: string
}

export function UnLazyImage(props: Props) {
  let target: HTMLImageElement

  onMount(() => {
    if (!target)
      return

    createEffect(() => {
      const cleanup = lazyLoad(target, {
        blurhash: props.blurhash,
        blurhashSize: props.blurhashSize,
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
