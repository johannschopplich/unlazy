import type { Plugin } from 'vitest/config'
import type { ImageRequest } from './fixtures'
import { Buffer } from 'node:buffer'
import { IMAGE_REQUESTS_ROUTE, IMAGE_ROUTE, TINY_PNG } from './fixtures'

const PNG = Buffer.from(TINY_PNG.slice(TINY_PNG.indexOf(',') + 1), 'base64')

/**
 * Serves an uncached PNG under `IMAGE_ROUTE` plus an id (`?status=404` fails
 * it, `?failAfter=<n>` fails every request after the first `n`, `?delay=<ms>`
 * holds the response back) and reports the requests made for an id as JSON
 * under `IMAGE_REQUESTS_ROUTE` plus that id, so browser tests can count network
 * fetches the memory cache would hide from them.
 */
export function imageServer(): Plugin {
  const requestsById = new Map<string, ImageRequest[]>()

  return {
    name: 'unlazy:image-server',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url ?? '/', 'http://localhost')

        if (url.pathname.startsWith(IMAGE_REQUESTS_ROUTE)) {
          const id = url.pathname.slice(IMAGE_REQUESTS_ROUTE.length)
          response.setHeader('content-type', 'application/json')
          response.end(JSON.stringify(requestsById.get(id) ?? []))
          return
        }

        if (!url.pathname.startsWith(IMAGE_ROUTE)) {
          next()
          return
        }

        const id = url.pathname.slice(IMAGE_ROUTE.length)
        const requests = requestsById.get(id) ?? []
        requests.push({
          referer: request.headers.referer,
        })
        requestsById.set(id, requests)

        response.setHeader('cache-control', 'no-store')
        response.setHeader('access-control-allow-origin', '*')

        setTimeout(() => {
          const failAfter = url.searchParams.get('failAfter')
          if (url.searchParams.get('status') === '404' || (failAfter !== null && requests.length > Number(failAfter))) {
            response.statusCode = 404
            response.end()
            return
          }

          response.setHeader('content-type', 'image/png')
          response.end(PNG)
        }, Number(url.searchParams.get('delay') ?? 0))
      })
    },
  }
}
