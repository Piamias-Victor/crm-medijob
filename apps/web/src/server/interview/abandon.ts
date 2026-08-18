export type AbandonInterviewDeps = {
  findById: (id: string) => Promise<{ id: string; status: string; candidateId: string } | null>
  softDeleteInterview: (id: string) => Promise<{ candidateId: string } | null>
}

export async function abandonInterview(interviewId: string, deps: AbandonInterviewDeps) {
  const row = await deps.findById(interviewId)
  if (!row) throw new Error('INTERVIEW_NOT_FOUND')
  if (row.status !== 'DRAFT') throw new Error('INTERVIEW_NOT_DRAFT')
  const deleted = await deps.softDeleteInterview(interviewId)
  if (!deleted) throw new Error('INTERVIEW_NOT_FOUND')
  return { candidateId: deleted.candidateId }
}
