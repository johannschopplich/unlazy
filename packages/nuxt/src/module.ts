import { defu } from 'defu'
import { addComponent, createResolver, defineNuxtModule } from '@nuxt/kit'
import { name, version } from '../package.json'

export interface ModuleOptions {
  blurhash?: {
    /**
     * Whether to generate the blurry placeholder on the server-side if the `blurhash` prop is set.
     *
     * @default true
     */
    ssr?: boolean

    /**
     * The size of the longer edge (width or height) of the decoded BlurHash image, depending on the aspect ratio.
     * This value will be used to calculate the dimensions of the generated blurry placeholder from a BlurHash string.
     *
     * @default 32
     */
    size?: number
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name,
    version,
    configKey: 'unlazy',
    compatibility: {
      nuxt: '^3',
    },
  },
  defaults: {
    blurhash: {
      ssr: true,
      size: 32,
    },
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    // Add module options to public runtime config
    nuxt.options.runtimeConfig.public.unlazy = defu(
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
})
