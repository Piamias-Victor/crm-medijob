export function interviewStartPath(candidateId?: string) {
  return candidateId ? `/candidats/${candidateId}/entretiens/new` : '/candidats/entretiens/new'
}

export function interviewDraftPath(candidateId: string, interviewId: string) {
  return `/candidats/${candidateId}/entretiens/${interviewId}`
}

export function interviewClosePath(candidateId: string, interviewId: string) {
  return `/candidats/${candidateId}/entretiens/${interviewId}/cloture`
}

export function interviewCandidateFichePath(candidateId: string) {
  return `/candidats/${candidateId}`
}
