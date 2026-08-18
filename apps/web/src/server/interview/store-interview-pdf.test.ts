import { describe, expect, it } from 'vitest'
import { interviewPdfInputFixture } from '@/view-models/interview-pdf.fixture'
import { interviewPdfFilename } from '@/view-models/interview-pdf-filename'
import {
  storeInterviewCompteRendu,
  type StoreInterviewPdfDeps,
} from '@/server/interview/store-interview-pdf'

function memoryStore(seed?: Partial<StoreInterviewPdfDeps>): StoreInterviewPdfDeps & {
  documents: { id: string; name: string; candidateId: string; mimeType: string }[]
} {
  const documents: { id: string; name: string; candidateId: string; mimeType: string }[] = []
  return {
    documents,
    loadSnapshot: async () => ({
      candidateId: 'c1',
      status: 'CLOSED',
      input: interviewPdfInputFixture,
    }),
    findDocumentByName: async (candidateId, name) =>
      documents.find((doc) => doc.candidateId === candidateId && doc.name === name) ?? null,
    renderPdf: async () => Buffer.from('%PDF-fake'),
    uploadBlob: async () => ({ url: 'https://blob.example/cr.pdf' }),
    createDocument: async (data) => {
      const doc = { id: `d${documents.length + 1}`, name: data.name, candidateId: data.candidateId, mimeType: data.mimeType }
      documents.push(doc)
      return doc
    },
    ...seed,
  }
}

describe('storeInterviewCompteRendu', () => {
  it('stores a PDF document on the candidate', async () => {
    const deps = memoryStore()
    const result = await storeInterviewCompteRendu('i1', deps)
    expect(result).toEqual({ documentId: 'd1', candidateId: 'c1' })
    expect(deps.documents[0]).toMatchObject({
      name: interviewPdfFilename('i1'),
      candidateId: 'c1',
      mimeType: 'application/pdf',
    })
  })

  it('reuses an existing compte-rendu instead of duplicating it', async () => {
    const deps = memoryStore()
    deps.documents.push({ id: 'd9', name: interviewPdfFilename('i1'), candidateId: 'c1', mimeType: 'application/pdf' })
    expect(await storeInterviewCompteRendu('i1', deps)).toEqual({ documentId: 'd9', candidateId: 'c1' })
    expect(deps.documents).toHaveLength(1)
  })
})
