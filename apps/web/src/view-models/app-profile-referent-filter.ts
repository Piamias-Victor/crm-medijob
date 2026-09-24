export function matchesMineOrUnassigned(
  referentId: string | null,
  currentUserId: string,
): boolean {
  return referentId == null || referentId === currentUserId
}
