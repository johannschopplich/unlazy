import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'
import { bundle } from '../../unlazy/test/bundle'
import config from '../tsdown.config'

it('prepends the \'use client\' directive to the bundle', async () => {
  const code = await bundle(config, fileURLToPath(new URL('..', import.meta.url)))

  expect(code).toMatch(/^'use client'/)
})
