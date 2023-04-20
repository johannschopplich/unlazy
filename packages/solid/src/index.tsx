// eslint-disable-next-line unused-imports/no-unused-imports
import { template } from 'solid-js/web'
import { createEffect, createSignal, onCleanup } from 'solid-js'
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
  const [target, setTarget] = createSignal<HTMLImageElement | null>(null)

  createEffect(() => {
    const currentTarget = target()
    if (currentTarget) {
      const cleanup = lazyLoad(currentTarget, {
        blurhash: props.blurhash,
        blurhashSize: props.blurhashSize,
      })

      onCleanup(() => {
        cleanup()
      })
    }
  })

  return (
    <img
      ref={setTarget}
      data-sizes={props.autoSizes ? 'auto' : undefined}
      loading="lazy"
      {...props}
    />
  )
}
