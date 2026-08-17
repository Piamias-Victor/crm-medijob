export function interviewStartPath(candidateId?: string) {
  return candidateId ? `/candidats/${candidateId}/entretiens/new` : '/candidats/entretiens/new'
}

export function interviewDraftPath(candidateId: string, interviewId: string) {
  return `/candidats/${candidateId}/entretiens/${interviewId}`
}
