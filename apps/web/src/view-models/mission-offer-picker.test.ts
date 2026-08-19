import { describe, expect, it } from 'vitest'
import {
  missionOffreHref,
  toMissionOfferPickerOptions,
} from '@/view-models/mission-offer-picker'

const open = {
  id: 'm1',
  title: 'CDI Pharmacien Lyon',
  status: 'EN_RECHERCHE' as const,
  pharmacy: { name: 'Pharmacie du Parc' },
}

describe('mission-offer-picker', () => {
  it('builds combobox options and skips closed missions', () => {
    const options = toMissionOfferPickerOptions([
      open,
      { ...open, id: 'm2', status: 'POURVU', title: 'Pourvue' },
      { ...open, id: 'm3', status: 'ANNULEE', title: 'Annulée' },
    ])
    expect(options).toEqual([
      { value: 'm1', label: 'CDI Pharmacien Lyon — Pharmacie du Parc' },
    ])
  })

  it('points to the mission Offre tab', () => {
    expect(missionOffreHref('m1')).toBe('/missions/m1?tab=offre')
  })
})
