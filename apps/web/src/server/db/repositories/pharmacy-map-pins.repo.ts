import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'
import type { LeanMapPinRow } from '@/view-models/lean-map-pin-row'
import type { MapPinsDb } from '@/server/db/repositories/map-pins.db'

export async function listPharmacyMapPins(
  db: MapPinsDb,
  take = DEFAULT_LIST_LIMIT,
): Promise<LeanMapPinRow[]> {
  const rows = (await db.pharmacy.findMany({
    where: {
      ...NOT_DELETED,
      latitude: { not: null },
      longitude: { not: null },
    },
    select: { id: true, name: true, latitude: true, longitude: true },
    take,
    orderBy: { name: 'asc' },
  })) as Array<{
    id: string
    name: string
    latitude: number
    longitude: number
  }>
  return rows.map((row) => ({
    id: row.id,
    label: row.name,
    latitude: row.latitude,
    longitude: row.longitude,
  }))
}
