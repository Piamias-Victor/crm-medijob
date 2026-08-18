import { buildInterviewPdfModel } from '@/view-models/interview-pdf-sections'
import { interviewPdfFilename } from '@/view-models/interview-pdf-filename'
import type { InterviewPdfInput, InterviewPdfModel } from '@/view-models/interview-pdf-model'

export type InterviewPdfStoreSnapshot = {
  candidateId: string
  status: 'DRAFT' | 'CLOSED'
  input: InterviewPdfInput | null
}

export type StoreInterviewPdfDeps = {
  loadSnapshot: (id: string) => Promise<InterviewPdfStoreSnapshot | null>
  findDocumentByName: (candidateId: string, name: string) => Promise<{ id: string } | null>
  renderPdf: (model: InterviewPdfModel) => Promise<Buffer>
  uploadBlob: (input: { pathname: string; body: Buffer; contentType: string }) => Promise<{ url: string }>
  createDocument: (data: {
    entityType: 'CANDIDATE'
    category: 'AUTRE'
    name: string
    url: string
    size: number
    mimeType: string
    candidateId: string
  }) => Promise<{ id: string }>
}

export async function storeInterviewCompteRendu(interviewId: string, deps: StoreInterviewPdfDeps) {
  const snapshot = await deps.loadSnapshot(interviewId)
  if (!snapshot) throw new Error('INTERVIEW_NOT_FOUND')
  if (snapshot.status !== 'CLOSED' || !snapshot.input) throw new Error('INTERVIEW_NOT_CLOSED')
  const name = interviewPdfFilename(interviewId)
  const existing = await deps.findDocumentByName(snapshot.candidateId, name)
  if (existing) return { documentId: existing.id, candidateId: snapshot.candidateId }
  const buffer = await deps.renderPdf(buildInterviewPdfModel(snapshot.input))
  const blob = await deps.uploadBlob({
    pathname: `candidate/${snapshot.candidateId}/${name}`,
    body: buffer,
    contentType: 'application/pdf',
  })
  const doc = await deps.createDocument({
    entityType: 'CANDIDATE',
    category: 'AUTRE',
    name,
    url: blob.url,
    size: buffer.length,
    mimeType: 'application/pdf',
    candidateId: snapshot.candidateId,
  })
  return { documentId: doc.id, candidateId: snapshot.candidateId }
}
