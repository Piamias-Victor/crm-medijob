import { describe, expect, it } from 'vitest'
import { interviewCaller, makeInterviewDeps } from '@/server/routers/interview.test.fixtures'
import { interviewPdfInputFixture } from '@/view-models/interview-pdf.fixture'
import { INTERVIEW_PDF_NOT_CLOSED } from '@/view-models/interview-pdf-copy'
import type { StoreInterviewPdfDeps } from '@/server/interview/store-interview-pdf'

const pdfStore: StoreInterviewPdfDeps = {
  loadSnapshot: async () => ({ candidateId: 'c1', status: 'CLOSED', input: interviewPdfInputFixture }),
  findDocumentByName: async () => null,
  renderPdf: async () => Buffer.from('%PDF-fake'),
  uploadBlob: async () => ({ url: 'https://blob.example/cr.pdf' }),
  createDocument: async () => ({ id: 'd1' }),
}

describe('interviewRouter generatePdf', () => {
  it('stores a compte-rendu for a CLOSED interview', async () => {
    const caller = interviewCaller({ ...makeInterviewDeps(), ...pdfStore })
    expect(await caller.generatePdf({ id: 'i1' })).toEqual({ documentId: 'd1', candidateId: 'c1' })
  })

  it('refuses to generate a PDF for a DRAFT interview', async () => {
    const caller = interviewCaller({
      ...makeInterviewDeps(),
      ...pdfStore,
      loadSnapshot: async () => ({ candidateId: 'c1', status: 'DRAFT', input: null }),
    })
    await expect(caller.generatePdf({ id: 'i1' })).rejects.toMatchObject({
      message: INTERVIEW_PDF_NOT_CLOSED,
    })
  })
})
