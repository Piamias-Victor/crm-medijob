import type { InterviewDecision } from '@prisma/client'
import { parseInterviewAnswers } from '@/view-models/interview-draft.schema'
import { diffInterviewMapping } from '@/view-models/interview-mapping'
import { selectInterviewPatch } from '@/view-models/interview-mapping-patch'
import type { MappingQuestion } from '@/view-models/interview-mapping-extract'
import type { InterviewMappingProfile } from '@/view-models/interview-mapping-types'
import { proposeCandidateStatus } from '@/view-models/interview-propose-status'
import type { CandidateStatus, ManualCandidateStatus } from '@/view-models/candidate-status'

export type CloseSideEffectInput = {
  decision: InterviewDecision
  overwriteFields?: string[]
  applyStatus?: boolean
  blacklist?: boolean
}

export type CloseSideEffectProfile = InterviewMappingProfile & { status: CandidateStatus }

export function buildCloseSideEffects(
  input: CloseSideEffectInput,
  row: { mode: 'INTERIM' | 'CDD_CDI'; answers: unknown },
  profile: CloseSideEffectProfile,
  questions: MappingQuestion[],
): { mapping: Record<string, unknown>; status: ManualCandidateStatus | null } {
  const diffs = diffInterviewMapping(parseInterviewAnswers(row.answers), profile, {
    mode: row.mode,
    questions,
  })
  return {
    mapping: selectInterviewPatch(diffs, input.overwriteFields ?? []),
    status: input.applyStatus
      ? proposeCandidateStatus(input.decision, profile.status, input.blacklist === true)
      : null,
  }
}
