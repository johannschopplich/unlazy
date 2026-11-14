import type { NuxtModule } from '@nuxt/schema'
import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'
import { defu } from 'defu'
import { name, version } from '../package.json'

export type { UnLazySource } from 'unlazy'

// #region ModuleOptions
export interface ModuleOptions {
  /**
   * Whether to generate the blurry placeholder on the server-side if a BlurHash
   * or ThumbHash is provided via the `blurhash`, respectively `thumbhash` prop.
   *
   * @default true
   */
  ssr?: boolean

  /**
   * The size of the longer edge (width or height) of the BlurHash image to be
   * decoded, depending on the aspect ratio.
   *
   * @remarks
   * This option is ignored if a ThumbHash is used.
   *
   * @default 32
   */
  placeholderSize?: number
}
// #endregion ModuleOptions

const module: NuxtModule<ModuleOptions, ModuleOptions, false> = defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'unlazy',
    compatibility: {
      nuxt: '>=4',
    },
  },
  defaults: {
    ssr: true,
    placeholderSize: 32,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.unlazy = defu(
      nuxt.options.runtimeConfig.public.unlazy,
      options,
    )

    nuxt.options.build.transpile.push(resolve('runtime'))

    addComponent({
      name: 'UnLazyImage',
      filePath: resolve('runtime/components/UnLazyImage.vue'),
    })
  },
})

export default module
