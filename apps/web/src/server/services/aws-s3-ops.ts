import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3'
import type { S3ObjectOps } from '@/server/services/s3-blob-client'

async function bodyToBuffer(body: unknown): Promise<Buffer> {
  if (!body || typeof body !== 'object') return Buffer.alloc(0)
  if (body instanceof Uint8Array) return Buffer.from(body)
  if ('transformToByteArray' in body && typeof body.transformToByteArray === 'function') {
    return Buffer.from(await body.transformToByteArray())
  }
  return Buffer.alloc(0)
}

export function createAwsS3ObjectOps(region: string): S3ObjectOps {
  const client = new S3Client({ region })
  return {
    putObject: async ({ bucket, key, body, contentType }) => {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: body,
          ContentType: contentType,
        }),
      )
    },
    deleteObject: async ({ bucket, key }) => {
      await client.send(new DeleteObjectCommand({ Bucket: bucket, Key: key }))
    },
    getObject: async ({ bucket, key }) => {
      try {
        const result = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }))
        if (!result.Body) return null
        return {
          body: await bodyToBuffer(result.Body),
          contentType: result.ContentType ?? 'application/octet-stream',
        }
      } catch {
        return null
      }
    },
  }
}
