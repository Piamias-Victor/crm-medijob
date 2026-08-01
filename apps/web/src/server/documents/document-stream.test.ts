// @vitest-environment node
import { describe, it, expect, vi } from 'vitest'
import {
  documentContentDisposition,
  loadDocumentStream,
} from '@/server/documents/document-stream'

describe('documentContentDisposition', () => {
  it('builds inline disposition for preview', () => {
    expect(documentContentDisposition('inline', 'contrat.pdf')).toBe(
      "inline; filename*=UTF-8''contrat.pdf",
    )
  })

  it('builds attachment disposition for download', () => {
    expect(documentContentDisposition('attachment', 'note.docx')).toBe(
      "attachment; filename*=UTF-8''note.docx",
    )
  })
})

describe('loadDocumentStream', () => {
  it('returns 404 when document is missing', async () => {
    const result = await loadDocumentStream('d1', {
      findById: vi.fn().mockResolvedValue(null),
      fetchBlob: vi.fn(),
    })
    expect(result.status).toBe(404)
  })

  it('streams the blob with mime and filename', async () => {
    const stream = new ReadableStream()
    const result = await loadDocumentStream('d1', {
      findById: vi.fn().mockResolvedValue({
        name: 'scan.png',
        url: 'https://blob.example/scan.png',
        mimeType: 'image/png',
      }),
      fetchBlob: vi.fn().mockResolvedValue({
        stream,
        contentType: 'image/png',
      }),
    })

    expect(result.status).toBe(200)
    if (result.status === 200) {
      expect(result.stream).toBe(stream)
      expect(result.filename).toBe('scan.png')
      expect(result.contentType).toBe('image/png')
    }
  })
})
