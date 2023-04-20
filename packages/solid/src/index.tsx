import { createEffect, createSignal, onCleanup } from 'solid-js'
import { lazyLoad } from 'unlazy'
import type { UnLazyLoadOptions } from 'unlazy'
import type { JSX } from 'solid-js'

interface Props
  extends JSX.ImgHTMLAttributes<HTMLImageElement>,
  Pick<UnLazyLoadOptions, 'blurhashSize'> {
  autoSizes?: boolean
  blurhash?: string
}

export function LazyImage(props: Props) {
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
