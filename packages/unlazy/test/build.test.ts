import { copyFile, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'tsdown'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import configs from '../tsdown.config'
import { bundle } from './bundle'

const packageDirectory = fileURLToPath(new URL('..', import.meta.url))
const LCP_WARNING = 'LCP element is configured'
const MISSING_SOURCE_ERROR = 'Missing `data-src`'
const HASH_DECODING_ERROR = 'Failed to generate'
const PROCESS_REFERENCE = /\bprocess\b/

const cdnConfigs = configs.filter(config => config.entry === './src/bundle/index.iife.ts')
const npmConfigs = configs.filter(config => !cdnConfigs.includes(config))

let consumerDirectory: string
let distDirectory: string

beforeAll(async () => {
  consumerDirectory = await mkdtemp(join(tmpdir(), 'unlazy-build-'))
  const installDirectory = join(consumerDirectory, 'node_modules', 'unlazy')
  distDirectory = join(installDirectory, 'dist')

  for (const config of npmConfigs) {
    await build({
      ...config,
      config: false,
      cwd: packageDirectory,
      outDir: distDirectory,
      dts: false,
      clean: false,
      logLevel: 'silent',
    })
  }

  await copyFile(join(packageDirectory, 'package.json'), join(installDirectory, 'package.json'))
  await writeFile(join(consumerDirectory, 'consumer.js'), `import { lazyLoad } from 'unlazy'\nlazyLoad()\n`)
})

afterAll(async () => {
  await rm(consumerDirectory, { recursive: true, force: true })
})

describe('build output', () => {
  it('strips the dev logs and every `process` reference from the default build', async () => {
    const code = await readFile(join(distDirectory, 'index.js'), 'utf8')

    expect(code).not.toContain(LCP_WARNING)
    expect(code).not.toContain(MISSING_SOURCE_ERROR)
    expect(code).not.toContain(HASH_DECODING_ERROR)
    expect(code).not.toMatch(PROCESS_REFERENCE)
  })

  it('keeps the dev logs in the development build without a `process` reference', async () => {
    const code = await readFile(join(distDirectory, 'index.development.js'), 'utf8')

    expect(code).toContain(LCP_WARNING)
    expect(code).toContain(MISSING_SOURCE_ERROR)
    expect(code).toContain(HASH_DECODING_ERROR)
    expect(code).not.toMatch(PROCESS_REFERENCE)
  })

  it('strips the dev logs from every CDN build', async () => {
    expect(cdnConfigs).toHaveLength(4)

    for (const config of cdnConfigs) {
      const code = await bundle(config, packageDirectory)

      expect(code).not.toContain(LCP_WARNING)
      expect(code).not.toContain(MISSING_SOURCE_ERROR)
      expect(code).not.toContain(HASH_DECODING_ERROR)
    }
  })
})

describe('export conditions', () => {
  it('resolves the development build under the development condition', async () => {
    const code = await bundleConsumer(['development'])

    expect(code).toContain(LCP_WARNING)
  })

  it('resolves the default build under the production condition', async () => {
    const code = await bundleConsumer(['production'])

    expect(code).toMatch(/function lazyLoad\b/)
    expect(code).not.toContain(LCP_WARNING)
  })

  it('silences the development build with __UNLAZY_LOGGING__ set to false', async () => {
    const code = await bundleConsumer(['development'], { __UNLAZY_LOGGING__: 'false' })

    expect(code).not.toContain(LCP_WARNING)
  })
})

function bundleConsumer(conditionNames: string[], define?: Record<string, string>): Promise<string> {
  return bundle({
    entry: join(consumerDirectory, 'consumer.js'),
    platform: 'browser',
    define,
    inputOptions: {
      resolve: {
        conditionNames: ['import', 'browser', ...conditionNames],
      },
    },
  }, consumerDirectory)
}
