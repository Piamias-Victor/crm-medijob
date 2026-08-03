/** Durées de rétention (mois) — Q5 client. Job alert-only, pas de purge auto. */
export const RETENTION_MONTHS = {
  CANDIDATE_INACTIVE: 24,
  CANDIDATE_BLACKLISTED: 36,
  APPLICATION_REFUSED: 12,
  DOCUMENT_RIB_POST_MISSION: 12,
} as const

export type RetentionCategory = keyof typeof RETENTION_MONTHS

export function isDueForRetentionReview(
  category: RetentionCategory,
  referenceDate: Date,
  now: Date = new Date(),
): boolean {
  const months = RETENTION_MONTHS[category]
  const cutoff = new Date(now)
  cutoff.setUTCMonth(cutoff.getUTCMonth() - months)
  return referenceDate.getTime() <= cutoff.getTime()
}
