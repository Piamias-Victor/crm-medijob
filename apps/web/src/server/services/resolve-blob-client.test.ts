// @vitest-environment node
import { afterEach, describe, expect, it } from 'vitest'
import { resolveBlobClient } from '@/server/services/resolve-blob-client'
import { vercelBlobClient } from '@/server/services/blob'

afterEach(() => {
  delete process.env.S3_DOCUMENTS_BUCKET
  delete process.env.S3_DOCUMENTS_REGION
  delete process.env.BLOB_DRIVER
})

describe('resolveBlobClient', () => {
  it('uses Vercel when no S3 bucket configured', () => {
    expect(resolveBlobClient()).toBe(vercelBlobClient)
  })

  it('uses memory driver when BLOB_DRIVER=memory', async () => {
    process.env.BLOB_DRIVER = 'memory'
    const { url } = await resolveBlobClient().put({
      pathname: 't.pdf',
      body: Buffer.from('t'),
      contentType: 'application/pdf',
    })
    expect(url).toContain('memory.blob.local')
  })

  it('builds S3 client when bucket env is set', async () => {
    process.env.S3_DOCUMENTS_BUCKET = 'medijob-prod-docs'
    process.env.S3_DOCUMENTS_REGION = 'eu-west-3'
    const store = new Map<string, { body: Buffer; contentType: string }>()
    const client = resolveBlobClient({
      s3Ops: {
        putObject: async ({ key, body, contentType }) => {
          store.set(key, { body: Buffer.from(body), contentType })
        },
        deleteObject: async ({ key }) => {
          store.delete(key)
        },
        getObject: async ({ key }) => store.get(key) ?? null,
      },
    })
    const { url } = await client.put({
      pathname: 'a.pdf',
      body: Buffer.from('a'),
      contentType: 'application/pdf',
    })
    expect(url).toBe('https://medijob-prod-docs.s3.eu-west-3.amazonaws.com/a.pdf')
  })
})
