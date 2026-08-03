import { toMapPins, type MapPin } from '@/view-models/map-pins'
import type { PharmacyListRow } from '@/view-models/pharmacy-list'
import type { RawCandidate } from '@/view-models/candidate-kanban.types'
import type { RawMission } from '@/view-models/mission-kanban.types'

export function toPharmacyMapPins(rows: PharmacyListRow[]): MapPin[] {
  return toMapPins(
    rows.map((row) => ({
      id: row.id,
      label: row.name,
      latitude: row.latitude,
      longitude: row.longitude,
    })),
  )
}

export function toCandidateMapPins(rows: RawCandidate[]): MapPin[] {
  return toMapPins(
    rows.map((row) => ({
      id: row.id,
      label: `${row.firstName} ${row.lastName}`,
      latitude: row.latitude,
      longitude: row.longitude,
    })),
  )
}

export function toMissionMapPins(rows: RawMission[]): MapPin[] {
  return toMapPins(
    rows.map((row) => ({
      id: row.id,
      label: row.title,
      latitude: row.pharmacy.latitude,
      longitude: row.pharmacy.longitude,
    })),
  )
}
