import type { BlobClient } from '@/server/services/blob'
import { vercelBlobClient } from '@/server/services/blob'
import { memoryBlobClient } from '@/server/services/memory-blob-client'
import { s3BlobClient, type S3ObjectOps } from '@/server/services/s3-blob-client'
import { createAwsS3ObjectOps } from '@/server/services/aws-s3-ops'

export type ResolveBlobClientOptions = {
  s3Ops?: S3ObjectOps
}

let memorySingleton: BlobClient | null = null
let s3Singleton: BlobClient | null = null

export function resolveBlobClient(options: ResolveBlobClientOptions = {}): BlobClient {
  if (process.env.BLOB_DRIVER === 'memory') {
    memorySingleton ??= memoryBlobClient()
    return memorySingleton
  }
  const bucket = process.env.S3_DOCUMENTS_BUCKET?.trim()
  if (!bucket) return vercelBlobClient
  const region = process.env.S3_DOCUMENTS_REGION?.trim() || 'eu-west-3'
  if (options.s3Ops) return s3BlobClient({ bucket, region, ops: options.s3Ops })
  s3Singleton ??= s3BlobClient({ bucket, region, ops: createAwsS3ObjectOps(region) })
  return s3Singleton
}
