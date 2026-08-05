import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'
import { NOT_DELETED } from '@/server/db/repositories/soft-delete'
import type { LeanMapPinRow } from '@/view-models/lean-map-pin-row'
import type { MapPinsDb } from '@/server/db/repositories/map-pins.db'

export async function listMissionMapPins(
  db: MapPinsDb,
  take = DEFAULT_LIST_LIMIT,
): Promise<LeanMapPinRow[]> {
  const rows = (await db.mission.findMany({
    where: {
      ...NOT_DELETED,
      pharmacy: {
        ...NOT_DELETED,
        latitude: { not: null },
        longitude: { not: null },
      },
    },
    select: {
      id: true,
      title: true,
      pharmacy: { select: { latitude: true, longitude: true } },
    },
    take,
    orderBy: { title: 'asc' },
  })) as Array<{
    id: string
    title: string
    pharmacy: { latitude: number; longitude: number }
  }>
  return rows.map((row) => ({
    id: row.id,
    label: row.title,
    latitude: row.pharmacy.latitude,
    longitude: row.pharmacy.longitude,
  }))
}
