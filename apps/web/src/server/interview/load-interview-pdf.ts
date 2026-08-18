import { toInterviewPdfInput, type InterviewPdfIdentity, type InterviewPdfRow } from '@/view-models/interview-pdf-snapshot'
import type { InterviewPdfStoreSnapshot } from '@/server/interview/store-interview-pdf'

export type InterviewPdfLoadRow = InterviewPdfRow & {
  id: string
  candidateId: string
  referentId: string | null
}

export type LoadInterviewPdfDeps = {
  findInterview: (id: string) => Promise<InterviewPdfLoadRow | null>
  findIdentity: (candidateId: string) => Promise<Omit<InterviewPdfIdentity, 'referentName'> | null>
  findReferentName: (userId: string) => Promise<string | null>
  findTemplateSections: (row: InterviewPdfLoadRow) => Promise<unknown>
}

export async function loadInterviewPdfSnapshot(
  id: string,
  deps: LoadInterviewPdfDeps,
): Promise<InterviewPdfStoreSnapshot | null> {
  const row = await deps.findInterview(id)
  if (!row) return null
  const identity = await deps.findIdentity(row.candidateId)
  if (!identity) return null
  const interviewReferent = row.referentId ? await deps.findReferentName(row.referentId) : null
  const input = toInterviewPdfInput(
    row,
    { ...identity, referentName: interviewReferent },
    await deps.findTemplateSections(row),
  )
  return { candidateId: row.candidateId, status: row.status, input }
}
