import type { UserConfig } from 'tsdown'
import { build } from 'tsdown'

export async function bundle(config: UserConfig, cwd: string): Promise<string> {
  const handle = await build({
    ...config,
    config: false,
    cwd,
    write: false,
    dts: false,
    clean: false,
    logLevel: 'silent',
  })

  return handle.bundles
    .flatMap(output => output.chunks)
    .map(chunk => chunk.type === 'chunk'
      ? chunk.code
      : '')
    .join('\n')
}
