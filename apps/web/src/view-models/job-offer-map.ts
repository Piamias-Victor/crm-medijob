import { toMapPins, type MapPin } from '@/view-models/map-pins'
import type { JobOfferListRow } from '@/view-models/job-offer-list'

export function toJobOfferMapPins(rows: JobOfferListRow[]): MapPin[] {
  return toMapPins(
    rows.map((row) => ({
      entityId: row.id,
      entityType: 'mission' as const,
      label: `${row.title} (${row.source === 'mission' ? 'Mission' : 'Sans mission'})`,
      latitude: row.latitude,
      longitude: row.longitude,
    })),
  )
}

export function filterOffersBySource(
  rows: JobOfferListRow[],
  source: 'all' | 'mission' | 'standalone',
) {
  if (source === 'all') return rows
  return rows.filter((row) => row.source === source)
}
