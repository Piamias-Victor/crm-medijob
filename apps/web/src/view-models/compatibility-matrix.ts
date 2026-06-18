export type CompatibilityPair = {
  missionJobTitleId: string
  candidateJobTitleId: string
  score: number
}

export function compatibilityKey(missionId: string, candidateId: string): string {
  return `${missionId}:${candidateId}`
}

export function buildCompatibilityScores(pairs: CompatibilityPair[]): Map<string, number> {
  return new Map(
    pairs.map((p) => [
      compatibilityKey(p.missionJobTitleId, p.candidateJobTitleId),
      p.score,
    ]),
  )
}

/** @deprecated use buildCompatibilityScores */
export function buildCompatibilityKeys(pairs: Omit<CompatibilityPair, 'score'>[]): Set<string> {
  return new Set(
    pairs.map((p) => compatibilityKey(p.missionJobTitleId, p.candidateJobTitleId)),
  )
}
