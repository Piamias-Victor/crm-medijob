import type { InterviewMode } from '@prisma/client'
import { pinPublishedTemplateId } from '@/server/interview/pin-published-template'

export type StartInterviewInput = {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  jobTitleId: string
  mode: InterviewMode
  candidateId?: string
}

export type StartInterviewDeps = {
  findCandidateById: (id: string) => Promise<{ id: string; jobTitleId: string } | null>
  findDraftByCandidate: (candidateId: string) => Promise<{ id: string } | null>
  setJobTitleIfMissing: (id: string, jobTitleId: string) => Promise<void>
  createCandidate: (data: {
    firstName: string
    lastName: string
    email?: string
    phone?: string
    jobTitleId: string
    status: 'NOUVEAU'
    referentId: string
  }) => Promise<{ id: string }>
  createInterview: (data: {
    candidateId: string
    mode: InterviewMode
    referentId: string
    templateId: string | null
  }) => Promise<{ id: string }>
  findCandidateProfileKey: (candidateId: string) => Promise<string | null>
  findPublishedTemplate: (
    profileKey: string,
    mode: InterviewMode,
  ) => Promise<{ id: string } | null>
  isPairArchived: (profileKey: string, mode: InterviewMode) => Promise<boolean>
  logActivity: (input: { candidateId: string; authorId: string; content: string }) => Promise<void>
}

export class InterviewDraftOpenError extends Error {
  readonly name = 'InterviewDraftOpenError'
  constructor(readonly draftId: string) {
    super('INTERVIEW_DRAFT_OPEN')
  }
}

export async function startInterview(
  input: StartInterviewInput,
  actorId: string,
  deps: StartInterviewDeps,
) {
  if (input.candidateId) {
    const existing = await deps.findCandidateById(input.candidateId)
    if (!existing) throw new Error('CANDIDATE_NOT_FOUND')
    const draft = await deps.findDraftByCandidate(existing.id)
    if (draft) throw new InterviewDraftOpenError(draft.id)
    if (!existing.jobTitleId) await deps.setJobTitleIfMissing(existing.id, input.jobTitleId)
    const interview = await deps.createInterview({
      candidateId: existing.id,
      mode: input.mode,
      referentId: actorId,
      templateId: await pinPublishedTemplateId(existing.id, input.mode, deps),
    })
    await deps.logActivity({
      candidateId: existing.id,
      authorId: actorId,
      content: 'Entretien créé',
    })
    return { candidateId: existing.id, interviewId: interview.id, createdCandidate: false }
  }

  const candidate = await deps.createCandidate({
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    jobTitleId: input.jobTitleId,
    status: 'NOUVEAU',
    referentId: actorId,
  })
  const interview = await deps.createInterview({
    candidateId: candidate.id,
    mode: input.mode,
    referentId: actorId,
    templateId: await pinPublishedTemplateId(candidate.id, input.mode, deps),
  })
  await deps.logActivity({
    candidateId: candidate.id,
    authorId: actorId,
    content: 'Entretien créé',
  })
  return { candidateId: candidate.id, interviewId: interview.id, createdCandidate: true }
}
