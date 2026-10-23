/** True if setting filleule.sponsorId = sponsorId would close a loop. */
export async function wouldCreateCycle(
  filleuleId: string,
  sponsorId: string,
  findSponsorId: (id: string) => Promise<string | null>,
): Promise<boolean> {
  let current: string | null = sponsorId
  const seen = new Set<string>()
  while (current) {
    if (current === filleuleId) return true
    if (seen.has(current)) return true
    seen.add(current)
    current = await findSponsorId(current)
  }
  return false
}
