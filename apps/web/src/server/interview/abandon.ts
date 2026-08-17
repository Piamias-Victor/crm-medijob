export type AbandonInterviewDeps = {
  softDeleteInterview: (id: string) => Promise<{ candidateId: string } | null>
}

export async function abandonInterview(interviewId: string, deps: AbandonInterviewDeps) {
  const row = await deps.softDeleteInterview(interviewId)
  if (!row) throw new Error('INTERVIEW_NOT_FOUND')
  return { candidateId: row.candidateId }
}
