import { interviewCriterionMaxes } from '@/view-models/interview-criterion-maxes'
import { parseInterviewAnswers } from '@/view-models/interview-draft.schema'
import { parseScoringCatalog } from '@/view-models/interview-scoring-parse'
import { suggestInterviewScores } from '@/view-models/interview-scoring'
import { suggestInterviewDecision } from '@/view-models/interview-scoring-decision'
import { diffInterviewMapping } from '@/view-models/interview-mapping'
import { proposeCandidateStatus } from '@/view-models/interview-propose-status'
import type { CloseSideEffectProfile } from '@/server/interview/close-side-effects'
import type { CloseInterviewRow } from '@/server/interview/close'

export type PreviewCloseDeps = {
  findById: (id: string) => Promise<CloseInterviewRow | null>
  findCandidate: (id: string) => Promise<CloseSideEffectProfile | null>
  findTemplateSections: (interview: CloseInterviewRow) => Promise<unknown>
}

export async function previewInterviewClose(id: string, deps: PreviewCloseDeps) {
  const row = await deps.findById(id)
  if (!row || row.status !== 'DRAFT') return null
  const profile = await deps.findCandidate(row.candidateId)
  if (!profile) return null
  const catalog = parseScoringCatalog(await deps.findTemplateSections(row))
  const answers = parseInterviewAnswers(row.answers)
  const scores = suggestInterviewScores(answers, catalog)
  const decision = suggestInterviewDecision(scores, catalog, answers)
  return {
    scores,
    scoreMax: interviewCriterionMaxes(catalog),
    decision,
    diffs: diffInterviewMapping(answers, profile, {
      mode: row.mode,
      questions: catalog.map(({ id: questionId, question }) => ({ id: questionId, question })),
    }),
    proposedStatus: proposeCandidateStatus(decision, profile.status, false),
    currentStatus: profile.status,
    candidateId: row.candidateId,
    cvSummary: profile.cvSummary,
  }
}

export type InterviewClosePreview = NonNullable<Awaited<ReturnType<typeof previewInterviewClose>>>
