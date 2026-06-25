export function syncRadiusPharmacySelection(previous: string[], nextPharmacyIds: string[]) {
  const nextSet = new Set(nextPharmacyIds)
  const preserved = previous.filter((id) => nextSet.has(id))
  return preserved.length > 0 ? preserved : nextPharmacyIds
}
