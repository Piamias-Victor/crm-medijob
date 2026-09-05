// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { s3BlobClient, type S3ObjectOps } from '@/server/services/s3-blob-client'

function memoryOps(bucket: string): S3ObjectOps {
  const store = new Map<string, { body: Buffer; contentType: string }>()
  return {
    putObject: async ({ key, body, contentType }) => {
      store.set(`${bucket}/${key}`, { body: Buffer.from(body), contentType })
    },
    deleteObject: async ({ key }) => {
      store.delete(`${bucket}/${key}`)
    },
    getObject: async ({ key }) => {
      const entry = store.get(`${bucket}/${key}`)
      return entry ?? null
    },
  }
}

async function readAll(stream: ReadableStream<Uint8Array>): Promise<Buffer> {
  const reader = stream.getReader()
  const chunks: Uint8Array[] = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(value)
  }
  return Buffer.concat(chunks.map((c) => Buffer.from(c)))
}

describe('s3BlobClient', () => {
  it('puts then reads object via S3 URL', async () => {
    const bucket = 'medijob-prod-docs'
    const client = s3BlobClient({
      bucket,
      region: 'eu-west-3',
      ops: memoryOps(bucket),
    })
    const body = Buffer.from('hello-s3')
    const { url } = await client.put({
      pathname: 'pharmacy/p1/contrat.pdf',
      body,
      contentType: 'application/pdf',
    })
    expect(url).toBe(
      'https://medijob-prod-docs.s3.eu-west-3.amazonaws.com/pharmacy/p1/contrat.pdf',
    )
    const got = await client.getStream(url)
    expect(got?.contentType).toBe('application/pdf')
    expect(await readAll(got!.stream)).toEqual(body)
  })

  it('deletes object so getStream returns null', async () => {
    const bucket = 'medijob-prod-docs'
    const client = s3BlobClient({ bucket, region: 'eu-west-3', ops: memoryOps(bucket) })
    const { url } = await client.put({
      pathname: 'x.pdf',
      body: Buffer.from('x'),
      contentType: 'application/pdf',
    })
    await client.del(url)
    expect(await client.getStream(url)).toBeNull()
  })
})
