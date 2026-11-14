import { fileURLToPath } from 'node:url'
import { expect, it } from 'vitest'
import { bundle } from '../../unlazy/test/bundle'
import configs from '../tsdown.config'

it('keeps the JSX in the `solid` condition entry', async () => {
  const solidConditionConfig = configs.find(config => config.dts === false)!
  const code = await bundle(solidConditionConfig, fileURLToPath(new URL('..', import.meta.url)))

  expect(code).toMatch(/<img\s/)
})
