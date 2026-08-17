import { buildCandidateCreateDefaults } from '@/view-models/candidate-create-defaults'
import type { CandidateCreateInput } from '@/view-models/candidate-profile.schema'
import type { InterviewStartInput } from '@/view-models/interview-start.schema'

type InterviewDuplicateSource = {
  incoming: CandidateCreateInput
  interviewMode: InterviewStartInput['mode']
}

export function toCandidateCreateInputFromInterviewStart(
  data: InterviewStartInput,
): CandidateCreateInput {
  return {
    ...buildCandidateCreateDefaults(null, data.jobTitleId),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
  }
}

export function interviewDuplicateProbeEnabled(candidateId?: string) {
  return !candidateId
}

export function buildInterviewStartFromDuplicateDraft(
  draft: InterviewDuplicateSource,
  keptCandidateId?: string,
): InterviewStartInput {
  return {
    candidateId: keptCandidateId,
    firstName: draft.incoming.firstName,
    lastName: draft.incoming.lastName,
    email: draft.incoming.email,
    phone: draft.incoming.phone,
    jobTitleId: draft.incoming.jobTitleId,
    mode: draft.interviewMode,
  }
}
