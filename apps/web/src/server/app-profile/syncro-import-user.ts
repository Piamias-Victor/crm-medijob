export function resolveSyncroUserName(
  sheetName: string | null | undefined,
  users: readonly { id: string; name: string }[],
): string | null {
  if (!sheetName?.trim()) return null
  const token = sheetName.trim().split(/\s+/)[0]!.toLowerCase()
  const hit = users.find((u) => u.name.trim().split(/\s+/)[0]!.toLowerCase() === token)
  return hit?.id ?? null
}
