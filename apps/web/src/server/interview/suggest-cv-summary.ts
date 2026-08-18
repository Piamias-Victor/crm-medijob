import { runCandidateSummary } from '@/server/ai/candidate-summary'
import type { AssistantProvider } from '@/server/ai/provider'
import type { CloseInterviewRow } from '@/server/interview/close'
import type { CloseSideEffectProfile } from '@/server/interview/close-side-effects'
import { formatInterviewAnswers } from '@/view-models/interview-cv-summary-answers'
import { parseInterviewAnswers } from '@/view-models/interview-draft.schema'
import { parseScoringCatalog } from '@/view-models/interview-scoring-parse'

export type SuggestCvSummaryDeps = {
  findById: (id: string) => Promise<CloseInterviewRow | null>
  findCandidate: (id: string) => Promise<CloseSideEffectProfile | null>
  findTemplateSections: (
    candidateId: string,
    mode: CloseInterviewRow['mode'],
  ) => Promise<unknown>
  provider: AssistantProvider
}

export async function suggestInterviewCvSummary(id: string, deps: SuggestCvSummaryDeps) {
  const row = await deps.findById(id)
  if (!row) throw new Error('INTERVIEW_NOT_FOUND')
  if (row.status !== 'DRAFT') throw new Error('INTERVIEW_NOT_DRAFT')
  const profile = await deps.findCandidate(row.candidateId)
  if (!profile) throw new Error('CANDIDATE_NOT_FOUND')
  const catalog = parseScoringCatalog(await deps.findTemplateSections(row.candidateId, row.mode))
  const cvSummary = await runCandidateSummary(deps.provider, {
    notes: formatInterviewAnswers(parseInterviewAnswers(row.answers), catalog) || null,
    jobTitleName: profile.jobTitleName,
    softwareNames: profile.softwareNames,
  })
  return { cvSummary }
}
