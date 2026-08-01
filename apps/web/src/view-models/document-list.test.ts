import { describe, it, expect } from 'vitest'
import { toDocumentListRow, type DocumentRecord } from '@/view-models/document-list'

const base: DocumentRecord = {
  id: 'd1',
  entityType: 'MISSION',
  category: 'CONTRAT',
  name: 'contrat.pdf',
  url: 'https://blob.example/contrat.pdf',
  size: 1024,
  mimeType: 'application/pdf',
  createdAt: new Date('2026-01-15T10:00:00.000Z'),
  pharmacyId: null,
  contactId: null,
  missionId: 'm1',
  candidateId: null,
}

describe('toDocumentListRow', () => {
  it('exposes mimeType for preview decisions', () => {
    const row = toDocumentListRow(base)
    expect(row.mimeType).toBe('application/pdf')
    expect(row.name).toBe('contrat.pdf')
  })
})
