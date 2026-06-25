export function buildPresentRadiusDraftKey(candidateId: string): string {
  return candidateId
}

export function acceptPresentRadiusDraftResponse<T>(
  activeKey: string,
  responseKey: string,
  draft: T,
): T | null {
  return activeKey === responseKey ? draft : null
}
