import { defu } from 'defu'
import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'
import { name, version } from '../package.json'

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
   * This option is ignored if the a ThumbHash is used.
   *
   * @default 32
   */
  placeholderSize?: number
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'unlazy',
    compatibility: {
      nuxt: '^3.5',
    },
  },
  defaults: {
    ssr: true,
    placeholderSize: 32,
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.unlazy = defu(
      // @ts-expect-error: Maybe not defined
      nuxt.options.runtimeConfig.public.unlazy,
      options,
    )

    // Transpile runtime
    nuxt.options.build.transpile.push(resolve('runtime'))

    addComponent({
      name: 'UnLazyImage',
      filePath: resolve('runtime/components/UnLazyImage.vue'),
    })
  },
}) as NuxtModule<ModuleOptions>
