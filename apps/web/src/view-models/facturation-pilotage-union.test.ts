import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { cancelledSliceMission, wonSliceMission } from '@/view-models/facturation-slices.test.fixtures'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

describe('buildPilotage union', () => {
  it('adds orphan accepted Devis CA when the Mission has no line', () => {
    expect(buildPilotage([], [wonSliceMission], { exercice: 'all' }).kpis).toMatchObject({
      ca: 4000,
      caPlacement: 4000,
      marge: 800,
      pharmaciesActives: 1,
      placementsActifs: 0,
    })
  })

  it('uses lines only when a Mission is linked', () => {
    const linked = pilotageLine({ id: 'l-link', missionId: wonSliceMission.id, amountHt: 1000, marge: 200 })
    expect(buildPilotage([linked], [wonSliceMission], { exercice: 'all' }).kpis).toMatchObject({
      ca: 1000,
      caPlacement: 1000,
      marge: 200,
    })
  })

  it('does not hide a Devis when the line has no Mission', () => {
    const unlinked = pilotageLine({ id: 'l-free', missionId: null, amountHt: 1000, marge: 200 })
    expect(buildPilotage([unlinked], [wonSliceMission], { exercice: 'all' }).kpis).toMatchObject({
      ca: 5000,
      caPlacement: 5000,
      marge: 1000,
    })
  })

  it('still hides Devis CA when the linked line is cancelled', () => {
    const linked = pilotageLine({
      id: 'l-ko',
      missionId: wonSliceMission.id,
      cancelled: true,
      amountHt: 1000,
      marge: 200,
    })
    const result = buildPilotage([linked], [wonSliceMission], { exercice: 'all' })
    expect(result.kpis.ca).toBe(0)
    expect(result.cancelled).toEqual({ count: 1, ca: 1000, marge: 200 })
  })

  it('ignores ANNULEE Mission Devis', () => {
    expect(buildPilotage([], [cancelledSliceMission], { exercice: 'all' }).kpis.ca).toBe(0)
  })
})
