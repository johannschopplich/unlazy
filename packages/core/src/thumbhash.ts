export function createPngDataUri(hash: string) {
  const worker = new Worker('./workers/thumbhash-worker.ts')
  worker.postMessage({ hash })

  return new Promise<string>((resolve) => {
    worker.onmessage = (event) => {
      worker.terminate();
      resolve(event.data)
    }
  })
}
