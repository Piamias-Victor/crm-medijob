import { describe, it, expect } from 'vitest'
import {
  buildDocumentPreviewUrl,
  buildDocumentDownloadUrl,
  isPreviewableDocument,
} from '@/lib/document-preview'

describe('isPreviewableDocument', () => {
  it('accepts pdf and image mime types', () => {
    expect(isPreviewableDocument({ mimeType: 'application/pdf', filename: 'a.pdf' })).toBe(true)
    expect(isPreviewableDocument({ mimeType: 'image/png', filename: 'a.png' })).toBe(true)
    expect(isPreviewableDocument({ mimeType: 'image/jpeg', filename: 'a.jpg' })).toBe(true)
  })

  it('rejects office and unknown formats', () => {
    expect(
      isPreviewableDocument({
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        filename: 'a.docx',
      }),
    ).toBe(false)
    expect(isPreviewableDocument({ mimeType: 'text/csv', filename: 'a.csv' })).toBe(false)
  })

  it('falls back to filename when mime is missing', () => {
    expect(isPreviewableDocument({ mimeType: null, filename: 'scan.PDF' })).toBe(true)
    expect(isPreviewableDocument({ mimeType: null, filename: 'scan.png' })).toBe(true)
    expect(isPreviewableDocument({ mimeType: null, filename: 'scan.docx' })).toBe(false)
  })
})

describe('buildDocumentPreviewUrl', () => {
  it('points to the authenticated preview route', () => {
    expect(buildDocumentPreviewUrl('doc-1')).toBe('/api/documents/doc-1/preview')
  })
})

describe('buildDocumentDownloadUrl', () => {
  it('points to the authenticated download route', () => {
    expect(buildDocumentDownloadUrl('doc-1')).toBe('/api/documents/doc-1/download')
  })
})
