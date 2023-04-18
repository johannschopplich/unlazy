import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import { github, ogDescription, ogImage, ogShortDescription, ogTitle, ogUrl, releases, version } from './meta'

const url = new URL(ogUrl)

export default defineConfig({
  lang: 'en-US',
  title: ogTitle,
  description: ogShortDescription,
  head: [
    ['meta', { name: 'theme-color', content: '#ffffff' }],
    ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { name: 'twitter:title', content: ogTitle }],
    ['meta', { name: 'twitter:description', content: ogDescription }],
    ['meta', { name: 'twitter:image', content: ogImage }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // Plausible analytics
    ['script', { 'src': 'https://plausible.io/js/script.js', 'defer': '', 'data-domain': url.hostname }],
  ],

  themeConfig: {
    logo: '/logo.svg',

    editLink: {
      pattern: 'https://github.com/johannschopplich/unlazy/edit/main/docs/:path',
      text: 'Suggest changes to this page',
    },

    nav: nav(),

    sidebar: {
      '/guide/': sidebarGuide(),
      '/integrations/': sidebarGuide(),
      '/cookbook/': sidebarGuide(),
      '/api/': sidebarApi(),
    },

    socialLinks: [
      { icon: 'github', link: github },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Johann Schopplich',
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
            { text: 'How It Works', link: '/guide/how-it-works' },
            { text: 'SEO Considerations', link: '/guide/seo-considerations' },
          ],
        },
      ],
    },
    {
      text: 'Integrations',
      activeMatch: '^/integrations/',
      items: [
        {
          text: 'Integrations',
          items: [
            { text: 'Vue', link: '/integrations/vue' },
            { text: 'Nuxt', link: '/integrations/nuxt' },
          ],
        },
      ],
    },
    {
      text: 'Cookbook',
      activeMatch: '^/cookbook/',
      items: [
        {
          text: 'Cookbook',
          items: [
            { text: 'Aspect Ratio', link: '/cookbook/aspect-ratio' },
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
          text: 'API',
          items: [
            { text: 'lazyLoad', link: '/api/lazy-load' },
            { text: 'autoSizes', link: '/api/auto-sizes' },
            { text: 'loadImage', link: '/api/load-image' },
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
        { text: 'How It Works', link: '/guide/how-it-works' },
        { text: 'SEO Considerations', link: '/guide/seo-considerations' },
      ],
    },
    {
      text: 'Integrations',
      items: [
        { text: 'Vue', link: '/integrations/vue' },
        { text: 'Nuxt', link: '/integrations/nuxt' },
      ],
    },
    {
      text: 'Cookbook',
      items: [
        { text: 'Aspect Ratio', link: '/cookbook/aspect-ratio' },
      ],
    },
    { text: 'Playground', link: 'https://github.com/johannschopplich/unlazy/tree/main/playground' },
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
  ]
}
