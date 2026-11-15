<script setup lang="ts">
import type { ResolveImageAttributesOptions } from 'unlazy'
import type { ModuleOptions } from '../../module'
import { UnLazyImage as VueUnLazyImage } from '@unlazy/vue/components'
import { createPlaceholderFromHash, resolveImageAttributes } from 'unlazy'
import { computed, toRaw, useAttrs, useId, useRuntimeConfig } from '#imports'

const props = withDefaults(
  // The listeners stay out of the runtime props, so they fall through to the
  // Vue component, which declares them as events.
  defineProps<ResolveImageAttributesOptions & /* @vue-ignore */ Pick<InstanceType<typeof VueUnLazyImage>['$props'], 'onImageLoad' | 'onImageError'> & {
    /** Aspect ratio (width / height) of the decoded BlurHash image. Only applies to a BlurHash decoded on the server, where it defaults to the ratio of the `width` and `height` attributes when both are positive numbers; a BlurHash decoded in the browser takes the ratio of the rendered image. */
    placeholderRatio?: number
    /** Whether the ThumbHash or BlurHash should be decoded on the server. Overrides the global module configuration if set. */
    ssr?: boolean
  }>(),
  {
    // A Boolean prop left out reads as `false`, so these defer to the default
    // of the Vue component and the module configuration.
    lazyLoad: undefined,
    ssr: undefined,
  },
)

const unlazy = useRuntimeConfig().public.unlazy as ModuleOptions
const id = useId()
const attrs = useAttrs()

// Setup runs on the server and again during hydration, where the same inputs
// decode to the same placeholder, so the server-rendered `src` stays.
const decodedPlaceholder = computed(() => {
  // A new placeholder would patch the `src` of a loaded image back to it, so
  // only a new source decodes again; the raw props are read untracked.
  void props.src
  void props.srcSet
  void props.sources
  const rawProps = toRaw(props)
  const { hash, hashType } = resolveImageAttributes(rawProps).lazyLoadOptions
  if (!(rawProps.ssr ?? unlazy.ssr) || !hash)
    return

  const placeholder = createPlaceholderFromHash({
    hash,
    hashType,
    size: rawProps.placeholderSize ?? unlazy.placeholderSize,
    ratio: rawProps.placeholderRatio ?? getAttributeRatio(attrs.width, attrs.height),
  })
  // `lazyLoad` adds a unique fragment only to placeholders it generates. An
  // identical placeholder URL that has already loaded elsewhere on the page
  // would fire `load` right away and fetch an off-screen image. `useId` keeps
  // the fragment equal on the server and during hydration.
  return placeholder && `${placeholder}#${id}`
})

const vueProps = computed(() => {
  const { placeholderRatio, ssr, ...forwardedProps } = props
  return decodedPlaceholder.value
    ? { ...forwardedProps, blurhash: undefined, thumbhash: undefined, placeholderSrc: decodedPlaceholder.value }
    : { ...forwardedProps, placeholderSize: props.placeholderSize ?? unlazy.placeholderSize }
})

function getAttributeRatio(width: unknown, height: unknown) {
  const widthValue = Number(width)
  const heightValue = Number(height)
  if (widthValue > 0 && heightValue > 0)
    return widthValue / heightValue
}
</script>

<template>
  <VueUnLazyImage v-bind="vueProps" />
</template>
