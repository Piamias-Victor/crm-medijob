import type { InterviewStartInput } from '@/view-models/interview-start.schema'

export function buildInterviewStartDefaults(input: {
  candidateId?: string
  firstName?: string
  lastName?: string
  email?: string | null
  phone?: string | null
  jobTitleId: string
}): InterviewStartInput {
  return {
    candidateId: input.candidateId,
    firstName: input.firstName ?? '',
    lastName: input.lastName ?? '',
    email: input.email ?? undefined,
    phone: input.phone ?? undefined,
    jobTitleId: input.jobTitleId,
    mode: 'INTERIM',
  }
}
