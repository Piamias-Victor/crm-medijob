import type { DevisRecord, DevisStatus } from '@/view-models/devis'

const LIVE_STATUSES: DevisStatus[] = ['SENT', 'ACCEPTED']

function liveRank(row: DevisRecord) {
  return row.sentAt?.getTime() ?? row.acceptedAt?.getTime() ?? row.updatedAt.getTime()
}

export function pickCurrentDevis(rows: DevisRecord[]): DevisRecord | null {
  const live = rows.filter((row) => LIVE_STATUSES.includes(row.status))
  if (live.length > 0) {
    return live.reduce((latest, row) => (liveRank(row) > liveRank(latest) ? row : latest))
  }
  const drafts = rows.filter((row) => row.status === 'DRAFT')
  if (drafts.length === 0) return null
  return drafts.reduce((latest, row) =>
    row.updatedAt.getTime() > latest.updatedAt.getTime() ? row : latest,
  )
}
