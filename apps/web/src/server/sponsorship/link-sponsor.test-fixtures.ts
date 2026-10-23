import type { LinkSponsorDeps, SponsorshipRow } from '@/server/sponsorship/link-sponsor'

export function memoryLinkDeps(seed: SponsorshipRow[]) {
  const rows = new Map(seed.map((r) => [r.id, { ...r }]))
  const logs: { entityId: string; authorId: string; content: string }[] = []
  const deps: LinkSponsorDeps & {
    rows: typeof rows
    logs: typeof logs
  } = {
    rows,
    logs,
    findActive: async (id) => rows.get(id) ?? null,
    findSponsorId: async (id) => rows.get(id)?.sponsorId ?? null,
    setSponsorId: async (filleuleId, sponsorId) => {
      const row = rows.get(filleuleId)
      if (!row) return
      row.sponsorId = sponsorId
    },
    logActivity: async (input) => {
      logs.push(input)
    },
  }
  return deps
}
