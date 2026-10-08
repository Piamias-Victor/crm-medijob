import { describe, expect, it, vi } from 'vitest'
import { copyRemoteCvToBlob } from './copy-cv'

describe('copyRemoteCvToBlob', () => {
  it('uploads the remote file into blob storage', async () => {
    const put = vi.fn().mockResolvedValue({ url: 'https://blob.vercel-storage.com/cv.pdf' })
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
      headers: { get: () => 'application/pdf' },
    })
    const url = await copyRemoteCvToBlob(
      'https://board.example/docs/lea.pdf',
      'a1',
      { put, del: vi.fn(), getStream: vi.fn().mockResolvedValue(null) },
      fetchFn as unknown as typeof fetch,
    )
    expect(url).toBe('https://blob.vercel-storage.com/cv.pdf')
    expect(put).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: 'candidate/application/a1/lea.pdf' }),
    )
  })

  it('reads a private blob via getStream before falling back to fetch', async () => {
    const put = vi.fn().mockResolvedValue({ url: 'https://blob.vercel-storage.com/copied.pdf' })
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array([9, 8, 7]))
        controller.close()
      },
    })
    const getStream = vi.fn().mockResolvedValue({
      stream,
      contentType: 'application/pdf',
    })
    const fetchFn = vi.fn()
    const url = await copyRemoteCvToBlob(
      'https://xxx.blob.vercel-storage.com/application/public-apply/a1/cv.pdf',
      'a1',
      { put, del: vi.fn(), getStream },
      fetchFn as unknown as typeof fetch,
    )
    expect(url).toBe('https://blob.vercel-storage.com/copied.pdf')
    expect(fetchFn).not.toHaveBeenCalled()
    expect(getStream).toHaveBeenCalled()
  })
})
