import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import { github, ogDescription, ogImage, ogTitle, ogUrl, releases, version } from './meta'

const url = new URL(ogUrl)

export default defineConfig({
  lang: 'en-US',
  title: ogTitle,
  description: ogDescription,
  head: [
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'Johann Schopplich' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:title', content: ogTitle }],
    ['meta', { name: 'twitter:description', content: ogDescription }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:site', content: '@jschopplich' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Plausible analytics
    ['script', { 'src': 'https://plausible.io/js/script.js', 'defer': '', 'data-domain': url.hostname }],
  ],

  appearance: 'dark',

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/johannschopplich/unlazy/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },

    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide(),
      '/placeholders/': sidebarGuide(),
      '/integrations/': sidebarGuide(),
      '/advanced/': sidebarGuide(),
      '/api/': sidebarApi(),
    },

    socialLinks: [
      { icon: 'github', link: github },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-PRESENT Johann Schopplich',
    },

    search: {
      provider: 'local',
    },
  },
})

function nav(): DefaultTheme.NavItem[] {
  return [
    {
      text: 'Guide',
      activeMatch: '^/guide/',
      items: [
        {
          text: 'Guide',
          items: [
            { text: 'Getting Started', link: '/guide/' },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Usage', link: '/guide/usage' },
            { text: 'SEO Considerations', link: '/guide/seo-considerations' },
          ],
        },
      ],
    },
    {
      text: 'Placeholders',
      activeMatch: '^/placeholders/',
      items: [
        {
          text: 'Placeholders',
          items: [
            { text: 'BlurHash', link: '/placeholders/blurhash' },
            { text: 'ThumbHash', link: '/placeholders/thumbhash' },
          ],
        },
      ],
    },
    {
      text: 'Integrations',
      activeMatch: '^/integrations/',
      items: [
        {
          text: 'How To',
          link: '/integrations/',
        },
        {
          text: 'Integrations',
          items: [
            { text: 'Vue', link: '/integrations/vue' },
            { text: 'Nuxt', link: '/integrations/nuxt' },
            { text: 'React', link: '/integrations/react' },
            { text: 'Solid', link: '/integrations/solid' },
            { text: 'Svelte', link: '/integrations/svelte' },
          ],
        },
      ],
    },
    {
      text: 'Advanced',
      activeMatch: '^/advanced/',
      items: [
        {
          text: 'Advanced',
          items: [
            { text: 'Build Flags', link: '/advanced/build-flags' },
            { text: 'Aspect Ratio', link: '/advanced/aspect-ratio' },
          ],
        },
      ],
    },
    {
      text: 'API',
      activeMatch: '^/api/',
      items: [
        {
          text: 'Overview',
          link: '/api/',
        },
        {
          text: 'Functions',
          items: [
            { text: 'lazyLoad', link: '/api/lazy-load' },
            { text: 'autoSizes', link: '/api/auto-sizes' },
            { text: 'loadImage', link: '/api/load-image' },
          ],
        },
        {
          text: 'BlurHash',
          items: [
            { text: 'createPngDataUri', link: '/api/blurhash-create-png-data-uri' },
          ],
        },
        {
          text: 'ThumbHash',
          items: [
            { text: 'createPngDataUri', link: '/api/thumbhash-create-png-data-uri' },
          ],
        },
      ],
    },
    {
      text: `v${version}`,
      items: [
        {
          text: 'Release Notes ',
          link: releases,
        },
      ],
    },
  ]
}

function sidebarGuide(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Guides',
      items: [
        { text: 'Getting Started', link: '/guide/' },
        { text: 'Installation', link: '/guide/installation' },
        { text: 'Usage', link: '/guide/usage' },
        { text: 'SEO Considerations', link: '/guide/seo-considerations' },
      ],
    },
    {
      text: 'Placeholders',
      items: [
        { text: 'BlurHash', link: '/placeholders/blurhash' },
        { text: 'ThumbHash', link: '/placeholders/thumbhash' },
      ],
    },
    {
      text: 'Integrations',
      items: [
        { text: 'How To', link: '/integrations/' },
        { text: 'Vue', link: '/integrations/vue' },
        { text: 'Nuxt', link: '/integrations/nuxt' },
        { text: 'React', link: '/integrations/react' },
        { text: 'Solid', link: '/integrations/solid' },
        { text: 'Svelte', link: '/integrations/svelte' },
      ],
    },
    {
      text: 'Advanced',
      items: [
        { text: 'Build Flags', link: '/advanced/build-flags' },
        { text: 'Aspect Ratio', link: '/advanced/aspect-ratio' },
      ],
    },
    { text: 'Playground', link: 'https://github.com/johannschopplich/unlazy/tree/main/packages/nuxt/playground' },
  ]
}

function sidebarApi(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'Overview',
      link: '/api/',
    },
    {
      text: 'Functions',
      items: [
        { text: 'lazyLoad', link: '/api/lazy-load' },
        { text: 'autoSizes', link: '/api/auto-sizes' },
        { text: 'loadImage', link: '/api/load-image' },
      ],
    },
    {
      text: 'BlurHash',
      items: [
        { text: 'createPngDataUri', link: '/api/blurhash-create-png-data-uri' },
      ],
    },
    {
      text: 'ThumbHash',
      items: [
        { text: 'createPngDataUri', link: '/api/thumbhash-create-png-data-uri' },
      ],
    },
  ]
}
