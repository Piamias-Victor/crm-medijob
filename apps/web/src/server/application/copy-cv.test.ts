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
      { put, del: vi.fn(), getStream: vi.fn() },
      fetchFn as unknown as typeof fetch,
    )
    expect(url).toBe('https://blob.vercel-storage.com/cv.pdf')
    expect(put).toHaveBeenCalledWith(
      expect.objectContaining({ pathname: 'candidate/application/a1/lea.pdf' }),
    )
  })
})
