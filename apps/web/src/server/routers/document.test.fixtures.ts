import { vi } from 'vitest'
import { createCallerFactory } from '@/server/trpc'
import { makeDocumentRouter, type DocumentDeps } from '@/server/routers/document'
import type { DocumentRecord } from '@/view-models/document-list'

export const documentRecord: DocumentRecord = {
  id: 'd1',
  entityType: 'PHARMACY',
  category: 'CONTRAT',
  name: 'contrat.pdf',
  url: 'https://blob.example/contrat.pdf',
  size: 2048,
  mimeType: 'application/pdf',
  createdAt: new Date('2026-06-01T10:00:00Z'),
  pharmacyId: 'p1',
  contactId: null,
  missionId: null,
  candidateId: null,
}

export const documentSession = {
  user: { id: 'u1', role: 'RECRUTEUR' as const },
  expires: '2999-01-01',
}

export function makeDocumentDeps(overrides: Partial<DocumentDeps> = {}): DocumentDeps {
  return {
    listByEntity: vi.fn().mockResolvedValue([documentRecord]),
    findById: vi.fn().mockResolvedValue(documentRecord),
    create: vi.fn().mockResolvedValue(documentRecord),
    deleteById: vi.fn().mockResolvedValue(documentRecord),
    uploadBlob: vi.fn().mockResolvedValue({ url: 'https://blob.example/contrat.pdf' }),
    deleteBlob: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

export function documentCaller(deps: DocumentDeps) {
  return createCallerFactory(makeDocumentRouter(deps))({ session: documentSession })
}
