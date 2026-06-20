// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { uploadDocumentSchema } from '@/server/routers/document.schema'

const base = {
  entityType: 'PHARMACY' as const,
  entityId: 'p1',
  category: 'CONTRAT' as const,
  size: 1024,
  dataBase64: Buffer.from('test').toString('base64'),
}

describe('uploadDocumentSchema', () => {
  it('accepts common office and image formats', () => {
    const cases = [
      { filename: 'contrat.pdf', mimeType: 'application/pdf' },
      { filename: 'logo.png', mimeType: 'image/png' },
      { filename: 'note.doc', mimeType: 'application/msword' },
      { filename: 'devis.docx', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { filename: 'data.csv', mimeType: 'text/csv' },
      { filename: 'tableau.xlsx', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
    ]
    for (const file of cases) {
      expect(uploadDocumentSchema.safeParse({ ...base, ...file }).success).toBe(true)
    }
  })

  it('rejects unsupported file types', () => {
    const result = uploadDocumentSchema.safeParse({
      ...base,
      filename: 'script.js',
      mimeType: 'application/javascript',
    })
    expect(result.success).toBe(false)
  })

  it('rejette upload si base64 décodé > size', () => {
    const bigBase64 = Buffer.alloc(2048).toString('base64')
    const result = uploadDocumentSchema.safeParse({
      ...base,
      size: 100,
      dataBase64: bigBase64,
    })
    expect(result.success).toBe(false)
  })
})
