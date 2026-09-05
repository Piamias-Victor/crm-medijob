// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { memoryBlobClient } from '@/server/services/memory-blob-client'

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

describe('memoryBlobClient', () => {
  it('stores bytes and reads them back', async () => {
    const client = memoryBlobClient()
    const body = Buffer.from('%PDF-fake')
    const { url } = await client.put({
      pathname: 'candidate/c1/cv.pdf',
      body,
      contentType: 'application/pdf',
    })
    const got = await client.getStream(url)
    expect(got?.contentType).toBe('application/pdf')
    expect(await readAll(got!.stream)).toEqual(body)
  })

  it('returns null after delete', async () => {
    const client = memoryBlobClient()
    const { url } = await client.put({
      pathname: 'doc.pdf',
      body: Buffer.from('x'),
      contentType: 'application/pdf',
    })
    await client.del(url)
    expect(await client.getStream(url)).toBeNull()
  })
})
