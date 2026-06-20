// @vitest-environment node
import { describe, it, expect } from 'vitest'
import {
  DOCUMENT_UPLOAD_ACCEPT,
  DOCUMENT_UPLOAD_HINT,
  isAllowedDocumentUpload,
} from '@/lib/document-upload'

describe('document upload allowlist', () => {
  it.each([
    { filename: 'contrat.pdf', mimeType: 'application/pdf' },
    { filename: 'scan.png', mimeType: 'image/png' },
    { filename: 'note.doc', mimeType: 'application/msword' },
    { filename: 'devis.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
    { filename: 'export.csv', mimeType: 'text/csv' },
    { filename: 'budget.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
  ])('accepts $filename', ({ filename, mimeType }) => {
    expect(isAllowedDocumentUpload({ filename, mimeType })).toBe(true)
  })

  it('rejects unsupported extensions', () => {
    expect(isAllowedDocumentUpload({ filename: 'virus.exe', mimeType: 'application/octet-stream' })).toBe(
      false,
    )
  })

  it('rejects octet-stream even when extension matches', () => {
    expect(isAllowedDocumentUpload({ filename: 'evil.pdf', mimeType: 'application/octet-stream' })).toBe(
      false,
    )
  })

  it('documents accepted formats for the file input', () => {
    expect(DOCUMENT_UPLOAD_ACCEPT).toContain('.pdf')
    expect(DOCUMENT_UPLOAD_ACCEPT).toContain('.xlsx')
    expect(DOCUMENT_UPLOAD_HINT).toContain('PDF')
    expect(DOCUMENT_UPLOAD_HINT).toContain('XLSX')
  })
})
