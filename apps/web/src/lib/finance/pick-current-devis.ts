import type { DevisRecord, DevisStatus } from '@/view-models/devis'

const CURRENT_STATUSES: DevisStatus[] = ['SENT', 'ACCEPTED']

export function pickCurrentDevis(rows: DevisRecord[]): DevisRecord | null {
  const eligible = rows.filter(
    (row) => CURRENT_STATUSES.includes(row.status) && row.sentAt != null,
  )
  if (eligible.length === 0) return null
  return eligible.reduce((latest, row) =>
    (row.sentAt?.getTime() ?? 0) > (latest.sentAt?.getTime() ?? 0) ? row : latest,
  )
}
