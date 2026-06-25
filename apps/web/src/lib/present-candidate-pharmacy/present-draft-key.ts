export function buildPresentDraftKey(candidateId: string, pharmacyId: string, contactId: string): string {
  return `${candidateId}:${pharmacyId}:${contactId}`
}

export function acceptPresentDraftResponse<T>(
  activeKey: string,
  responseKey: string,
  draft: T,
): T | null {
  return activeKey === responseKey ? draft : null
}
