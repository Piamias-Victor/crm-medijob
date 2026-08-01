// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import { documentFileResponse } from '@/server/documents/document-file-response'

describe('documentFileResponse', () => {
  it('rejects unauthenticated preview requests', async () => {
    const response = await documentFileResponse({
      id: 'd1',
      disposition: 'inline',
      session: null,
      deps: { findById: vi.fn(), fetchBlob: vi.fn() },
    })
    expect(response.status).toBe(401)
  })

  it('returns inline content for authenticated preview', async () => {
    const stream = new ReadableStream()
    const response = await documentFileResponse({
      id: 'd1',
      disposition: 'inline',
      session: { user: { id: 'u1' } },
      deps: {
        findById: vi.fn().mockResolvedValue({
          name: 'a.pdf',
          url: 'https://blob.example/a.pdf',
          mimeType: 'application/pdf',
        }),
        fetchBlob: vi.fn().mockResolvedValue({ stream, contentType: 'application/pdf' }),
      },
    })

    expect(response.status).toBe(200)
    expect(response.headers.get('Content-Disposition')).toContain('inline')
    expect(response.headers.get('Content-Type')).toBe('application/pdf')
  })
})
