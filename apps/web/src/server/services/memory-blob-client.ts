import type { BlobClient, BlobUploadInput } from '@/server/services/blob'

const MEMORY_HOST = 'memory.blob.local'

type Entry = { body: Buffer; contentType: string }

export function memoryBlobUrl(pathname: string): string {
  const key = pathname.replace(/^\/+/, '')
  return `https://${MEMORY_HOST}/${key}`
}

export function memoryBlobClient(seed: Map<string, Entry> = new Map()): BlobClient {
  return {
    put: async (input: BlobUploadInput) => {
      const url = memoryBlobUrl(input.pathname)
      seed.set(url, { body: Buffer.from(input.body), contentType: input.contentType })
      return { url }
    },
    del: async (url) => {
      seed.delete(url)
    },
    getStream: async (url) => {
      const entry = seed.get(url)
      if (!entry) return null
      return {
        contentType: entry.contentType,
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array(entry.body))
            controller.close()
          },
        }),
      }
    },
  }
}
