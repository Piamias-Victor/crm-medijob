import { del, get, put } from '@vercel/blob'

export const BLOB_ACCESS = 'private' as const

const VERCEL_BLOB_HOST_SUFFIX = '.blob.vercel-storage.com'

export function isAllowedBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    if (parsed.hostname.endsWith(VERCEL_BLOB_HOST_SUFFIX)) return true
    const extra = process.env.BLOB_URL_ALLOWLIST?.split(',').map((entry) => entry.trim()).filter(Boolean) ?? []
    return extra.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

export type BlobUploadInput = {
  pathname: string
  body: Buffer
  contentType: string
}

export type BlobClient = {
  put: (input: BlobUploadInput) => Promise<{ url: string }>
  del: (url: string) => Promise<void>
  getStream: (url: string) => Promise<{ stream: ReadableStream<Uint8Array>; contentType: string } | null>
}

export const vercelBlobClient: BlobClient = {
  put: ({ pathname, body, contentType }) =>
    put(pathname, body, { access: BLOB_ACCESS, contentType }).then((blob) => ({ url: blob.url })),
  del: (url) => del(url).then(() => undefined),
  getStream: async (url) => {
    const result = await get(url, { access: BLOB_ACCESS })
    if (!result || result.statusCode !== 200 || !result.stream) return null
    return { stream: result.stream, contentType: result.blob.contentType }
  },
}

export function uploadBlob(client: BlobClient, input: BlobUploadInput) {
  return client.put(input)
}

export function deleteBlob(client: BlobClient, url: string) {
  return client.del(url)
}

export function fetchBlobStream(client: BlobClient, url: string) {
  return client.getStream(url)
}
