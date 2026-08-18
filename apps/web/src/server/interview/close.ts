import type { InterviewDecision } from '@prisma/client'
import type { CloseSideEffectProfile } from '@/server/interview/close-side-effects'
import { buildCloseSideEffects } from '@/server/interview/close-side-effects'
import type { MappingQuestion } from '@/view-models/interview-mapping-extract'
import { INTERVIEW_DECISION_LABELS } from '@/view-models/interview-labels'
import type { InterviewRecord } from '@/view-models/interview-list'

export type CloseInterviewInput = {
  id: string
  scores: Record<string, number>
  decision: InterviewDecision
  overwriteFields?: string[]
  mappingEdits?: Record<string, string>
  applyStatus?: boolean
  blacklist?: boolean
}

export type CloseInterviewRow = InterviewRecord

export type CloseInterviewDeps = {
  findById: (id: string) => Promise<CloseInterviewRow | null>
  close: (
    id: string,
    data: { scores: Record<string, number>; decision: InterviewDecision },
  ) => Promise<void>
  findCandidate: (id: string) => Promise<CloseSideEffectProfile | null>
  findTemplateQuestions: (
    candidateId: string,
    mode: CloseInterviewRow['mode'],
  ) => Promise<MappingQuestion[]>
  applyCandidatePatch: (id: string, patch: Record<string, unknown>) => Promise<void>
  logActivity: (input: {
    candidateId: string
    authorId: string
    content: string
  }) => Promise<void>
}

export async function closeInterview(
  input: CloseInterviewInput,
  actorId: string,
  deps: CloseInterviewDeps,
) {
  const row = await deps.findById(input.id)
  if (!row) throw new Error('INTERVIEW_NOT_FOUND')
  if (row.status !== 'DRAFT') throw new Error('INTERVIEW_NOT_DRAFT')
  await deps.close(input.id, { scores: input.scores, decision: input.decision })
  const profile = await deps.findCandidate(row.candidateId)
  if (profile) {
    const questions = await deps.findTemplateQuestions(row.candidateId, row.mode)
    const effects = buildCloseSideEffects(input, { ...row, answers: row.answers ?? {} }, profile, questions)
    const patch = { ...effects.mapping, ...(effects.status ? { status: effects.status } : {}) }
    if (Object.keys(patch).length) await deps.applyCandidatePatch(row.candidateId, patch)
  }
  await deps.logActivity({
    candidateId: row.candidateId,
    authorId: actorId,
    content: `Entretien clôturé — ${INTERVIEW_DECISION_LABELS[input.decision]}`,
  })
  return { id: input.id, candidateId: row.candidateId }
}
