import type { JSX } from 'solid-js'
import type { TriggerLoadOptions, UnLazyImageProps } from 'unlazy'
import { createEffect, createMemo, createSignal, Index, onCleanup, Show, splitProps } from 'solid-js'
import { lazyLoad, reportImageOutcome, resolveImageAttributes } from 'unlazy'

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
      'onImageLoad',
      'onImageError',
    ],
  )

  const [target, setTarget] = createSignal<HTMLImageElement>()
  const attributes = createMemo(() => resolveImageAttributes(local))
  // The effect reads single fields, since `attributes` changes with every new
  // `sources` array.
  const hasRealSources = createMemo(() => attributes().hasRealSources)
  const sourcesKey = createMemo(() => attributes().sourcesKey)
  const hash = createMemo(() => attributes().hash)
  const hashType = createMemo(() => attributes().hashType)
  // Read the callbacks on call, so a new one does not reload the image.
  const outcomeCallbacks = {
    onImageLoad: (image: HTMLImageElement) => local.onImageLoad?.(image),
    onImageError: (image: HTMLImageElement, error: Event) => local.onImageError?.(image, error),
  }

  createEffect(() => {
    const image = target()
    if (!image || hasRealSources())
      return

    // Track changes to image sources to trigger reactivity.
    void local.src
    void local.srcSet
    void sourcesKey()

    const cleanup = lazyLoad(image, {
      hash: hash(),
      hashType: hashType(),
      placeholderSize: local.placeholderSize,
      updateSizesOnResize: local.autoSizes,
      preload: local.preload,
      ...outcomeCallbacks,
    })
    onCleanup(cleanup)
  })

  // `lazyLoad` reports the outcome of the images it swaps; an image with its
  // real sources in the markup reports its own.
  const handleOutcome = (event: Event) => {
    if (hasRealSources())
      reportImageOutcome(event.currentTarget as HTMLImageElement, event, outcomeCallbacks)
  }

  const renderImage = () => (
    <img
      ref={setTarget}
      {...attributes().image}
      on:load={handleOutcome}
      on:error={handleOutcome}
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
