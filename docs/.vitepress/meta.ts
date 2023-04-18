import { description, name, version } from '../../packages/unlazy/package.json'

export { version }

/* VitePress head */
export const ogUrl = 'https://unlazy.byjohann.dev/'
export const ogTitle = name
export const ogDescription = description
export const ogShortDescription = 'Universal lazy loading library'
export const ogImage = `${ogUrl}og.jpg`

/* GitHub and social links */
export const github = 'https://github.com/johannschopplich/unlazy'
export const releases = 'https://github.com/johannschopplich/unlazy/releases'
export const twitter = 'https://twitter.com/jschopplich'
