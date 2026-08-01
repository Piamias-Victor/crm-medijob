import { describe, it, expect } from 'vitest'
import { toMissionUpdateData } from '@/view-models/mission-update'
import type { MissionFormValues } from '@/view-models/mission-form.schema'

const values: MissionFormValues = {
  title: 'Mission test',
  jobTitleId: 'jt1',
  contractType: 'VACATION',
  pharmacyId: 'p1',
  referentId: 'r1',
  tempsPlein: true,
  startDate: new Date('2026-06-19T12:00:00'),
  profilRecherche: 'Profil senior',
}

describe('toMissionUpdateData', () => {
  it('maps profilRecherche to nullable string', () => {
    expect(toMissionUpdateData(values).profilRecherche).toBe('Profil senior')
  })

  it('maps empty profilRecherche to null', () => {
    expect(
      toMissionUpdateData({ ...values, profilRecherche: undefined }).profilRecherche,
    ).toBeNull()
  })
})
