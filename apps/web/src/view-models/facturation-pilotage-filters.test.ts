import { describe, expect, it } from 'vitest'
import { REFERENT_NONE } from '@/lib/constants/referent-none'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { sliceMission } from '@/view-models/facturation-slices.test.fixtures'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

const now = new Date('2026-08-24T00:00:00Z')

describe('buildPilotage filters', () => {
  it('splits INTERIM CA away from Placement KPIs', () => {
    const result = buildPilotage(
      [pilotageLine({ id: 'int', kind: 'INTERIM', amountHt: 3000, marge: 900 })],
      [],
    )
    expect(result.kpis).toMatchObject({
      ca: 3000,
      caPlacement: 0,
      caInterim: 3000,
      placementsActifs: 0,
    })
  })

  it('keeps Aug 2026 in Exercice 25/26 and drops Oct 2024', () => {
    const inYear = pilotageLine({ id: 'in', occurredAt: new Date('2026-08-01T00:00:00Z') })
    const out = pilotageLine({
      id: 'out',
      amountHt: 8000,
      occurredAt: new Date('2024-10-01T00:00:00Z'),
    })
    const result = buildPilotage([inYear, out], [], { exercice: '2025' }, now)
    expect(result.kpis.ca).toBe(5000)
    expect(result.months[0]).toBe('2025-10')
    expect(result.months.at(-1)).toBe('2026-09')
  })

  it('includes every date when Exercice is Tous', () => {
    const old = pilotageLine({ id: 'old', occurredAt: new Date('2024-10-01T00:00:00Z') })
    expect(buildPilotage([old], [], { exercice: 'all' }, now).kpis.ca).toBe(5000)
  })

  it('filters by Referent including Sans référent', () => {
    const alice = pilotageLine({ id: 'a', referentId: 'u-alice' })
    const none = pilotageLine({ id: 'n', referentId: null, amountHt: 700 })
    expect(buildPilotage([alice, none], [], { referentId: 'u-alice' }, now).kpis.ca).toBe(5000)
    expect(buildPilotage([alice, none], [], { referentId: REFERENT_NONE }, now).kpis.ca).toBe(700)
  })

  it('attributes orphan INTERIM Devis to intérim CA', () => {
    const mission = sliceMission({ id: 'm-int', contractType: 'INTERIM' })
    expect(buildPilotage([], [mission], { exercice: 'all' }, now).kpis).toMatchObject({
      caInterim: 4000,
      caPlacement: 0,
    })
  })
})
