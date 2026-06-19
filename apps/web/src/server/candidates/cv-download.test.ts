// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { loadCandidateCvStream } from '@/server/candidates/cv-download'

describe('loadCandidateCvStream', () => {
  it('returns 404 when the candidate has no cvUrl', async () => {
    const result = await loadCandidateCvStream('c1', {
      findCvUrl: vi.fn().mockResolvedValue(null),
      fetchBlob: vi.fn(),
    })
    expect(result.status).toBe(404)
  })

  it('streams the stored cv blob when available', async () => {
    const stream = new ReadableStream()
    const result = await loadCandidateCvStream('c1', {
      findCvUrl: vi.fn().mockResolvedValue({
        cvUrl: 'https://blob.example/candidate/c1/cv/cv.pdf',
      }),
      fetchBlob: vi.fn().mockResolvedValue({
        stream,
        contentType: 'application/pdf',
      }),
    })

    expect(result.status).toBe(200)
    if (result.status === 200) {
      expect(result.stream).toBe(stream)
      expect(result.filename).toBe('cv.pdf')
      expect(result.contentType).toBe('application/pdf')
    }
  })
})
