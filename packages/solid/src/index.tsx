import type { JSX } from 'solid-js'
import type { TriggerLoadOptions, UnLazyImageProps } from 'unlazy'
import { createEffect, createMemo, createSignal, Index, on, onCleanup, Show, splitProps } from 'solid-js'
import { lazyLoad, resolveImageAttributes } from 'unlazy'

export type { UnLazySource } from 'unlazy'

interface Props
  extends Omit<JSX.ImgHTMLAttributes<HTMLImageElement>, keyof UnLazyImageProps>,
  UnLazyImageProps,
  TriggerLoadOptions {}

export function UnLazyImage(props: Props) {
  const [local, rest] = splitProps(
    props,
    [
      'src',
      'srcSet',
      'sources',
      'autoSizes',
      'blurhash',
      'thumbhash',
      'placeholderSrc',
      'placeholderSize',
      'preload',
      'loading',
      'lazyLoad',
      'onImageLoad',
      'onImageError',
    ],
  )

  const [target, setTarget] = createSignal<HTMLImageElement>()
  const attributes = createMemo(() => resolveImageAttributes(local))
  // `attributes` changes with every new `sources` array, `loadKey` only with its content.
  const loadKey = createMemo(() => attributes().loadKey)
  // Read the callbacks on call, so a new one does not reload the image.
  const outcomeCallbacks = {
    onImageLoad: (image: HTMLImageElement) => local.onImageLoad?.(image),
    onImageError: (image: HTMLImageElement, error: Event) => local.onImageError?.(image, error),
  }

  createEffect(on([target, loadKey], ([image]) => {
    if (!image)
      return

    onCleanup(lazyLoad(image, {
      ...attributes().lazyLoadOptions,
      ...outcomeCallbacks,
    }))
  }))

  const renderImage = () => (
    <img
      ref={setTarget}
      {...attributes().image}
      {...rest}
    />
  )

  return (
    <Show when={local.sources?.length} fallback={renderImage()}>
      <picture>
        <Index each={attributes().sources}>
          {sourceAttributes => <source {...sourceAttributes()} />}
        </Index>
        {renderImage()}
      </picture>
    </Show>
  )
}
