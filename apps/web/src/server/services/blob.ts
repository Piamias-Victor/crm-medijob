import { del, get, put } from '@vercel/blob'

export const BLOB_ACCESS = 'private' as const

const VERCEL_BLOB_HOST_SUFFIX = '.blob.vercel-storage.com'
const MEMORY_BLOB_HOST = 'memory.blob.local'

function s3DocumentsHost(): string | null {
  const bucket = process.env.S3_DOCUMENTS_BUCKET?.trim()
  const region = process.env.S3_DOCUMENTS_REGION?.trim() || 'eu-west-3'
  if (!bucket) return null
  return `${bucket}.s3.${region}.amazonaws.com`
}

export function isAllowedBlobUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:') return false
    if (parsed.hostname.endsWith(VERCEL_BLOB_HOST_SUFFIX)) return true
    if (parsed.hostname === MEMORY_BLOB_HOST) return true
    const s3Host = s3DocumentsHost()
    if (s3Host && parsed.hostname === s3Host) return true
    const extra =
      process.env.BLOB_URL_ALLOWLIST?.split(',').map((entry) => entry.trim()).filter(Boolean) ?? []
    return extra.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`))
  } catch {
    return false
  }
}

export type BlobUploadInput = {
  pathname: string
  body: Buffer
  contentType: string
  allowOverwrite?: boolean
}

export type BlobClient = {
  put: (input: BlobUploadInput) => Promise<{ url: string }>
  del: (url: string) => Promise<void>
  getStream: (url: string) => Promise<{ stream: ReadableStream<Uint8Array>; contentType: string } | null>
}

export const vercelBlobClient: BlobClient = {
  put: ({ pathname, body, contentType, allowOverwrite }) =>
    put(pathname, body, { access: BLOB_ACCESS, contentType, allowOverwrite }).then((blob) => ({
      url: blob.url,
    })),
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
