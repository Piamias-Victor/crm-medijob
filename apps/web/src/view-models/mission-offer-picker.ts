import { MISSION_STATUS_ORDER } from '@/lib/mission-options'
import type { ComboboxOption } from '@/components/molecules/ComboboxDropdown.types'
import type { MissionStatus } from '@/view-models/mission-kanban.types'

export const OPEN_MISSION_STATUSES = MISSION_STATUS_ORDER.filter(
  (status) => status !== 'POURVU' && status !== 'ANNULEE',
)

export type MissionOfferPickerRow = {
  id: string
  title: string
  status: MissionStatus
  pharmacy: { name: string }
}

export function toMissionOfferPickerOptions(
  rows: MissionOfferPickerRow[],
): ComboboxOption[] {
  return rows
    .filter((row) => row.status !== 'POURVU' && row.status !== 'ANNULEE')
    .map((row) => ({
      value: row.id,
      label: `${row.title} — ${row.pharmacy.name}`,
    }))
}

export function missionOffreHref(missionId: string) {
  return `/missions/${missionId}?tab=offre`
}

export const CREATE_OFFER_LABEL = 'Créer une offre'
export const PICK_MISSION_TITLE = 'Choisir une mission'
export const PICK_MISSION_HINT =
  'L’offre est rattachée à une mission. La génération IA se fait ensuite sur l’onglet Offre.'
export const PICK_MISSION_CONTINUE = 'Continuer'
export const PICK_MISSION_CANCEL = 'Annuler'
export const PICK_MISSION_PLACEHOLDER = 'Mission'
