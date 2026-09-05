import type { BlobClient, BlobUploadInput } from '@/server/services/blob'

export type S3ObjectOps = {
  putObject: (input: {
    bucket: string
    key: string
    body: Buffer
    contentType: string
  }) => Promise<void>
  deleteObject: (input: { bucket: string; key: string }) => Promise<void>
  getObject: (input: {
    bucket: string
    key: string
  }) => Promise<{ body: Buffer; contentType: string } | null>
}

export type S3BlobConfig = {
  bucket: string
  region: string
  ops: S3ObjectOps
}

export function s3ObjectUrl(bucket: string, region: string, pathname: string): string {
  const key = pathname.replace(/^\/+/, '')
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`
}

export function parseS3ObjectUrl(
  url: string,
  bucket: string,
  region: string,
): { key: string } | null {
  try {
    const parsed = new URL(url)
    const host = `${bucket}.s3.${region}.amazonaws.com`
    if (parsed.hostname !== host) return null
    const key = parsed.pathname.replace(/^\/+/, '')
    return key ? { key } : null
  } catch {
    return null
  }
}

export function s3BlobClient(config: S3BlobConfig): BlobClient {
  const { bucket, region, ops } = config
  return {
    put: async (input: BlobUploadInput) => {
      const key = input.pathname.replace(/^\/+/, '')
      await ops.putObject({
        bucket,
        key,
        body: input.body,
        contentType: input.contentType,
      })
      return { url: s3ObjectUrl(bucket, region, key) }
    },
    del: async (url) => {
      const parsed = parseS3ObjectUrl(url, bucket, region)
      if (!parsed) return
      await ops.deleteObject({ bucket, key: parsed.key })
    },
    getStream: async (url) => {
      const parsed = parseS3ObjectUrl(url, bucket, region)
      if (!parsed) return null
      const object = await ops.getObject({ bucket, key: parsed.key })
      if (!object) return null
      return {
        contentType: object.contentType,
        stream: new ReadableStream({
          start(controller) {
            controller.enqueue(new Uint8Array(object.body))
            controller.close()
          },
        }),
      }
    },
  }
}
