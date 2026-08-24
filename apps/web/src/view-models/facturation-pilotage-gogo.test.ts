import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { PILOTAGE_GOGO_CAPTION } from '@/view-models/facturation-pilotage-gogo-copy'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

const now = new Date('2026-08-24T00:00:00Z')

describe('buildPilotage Go/NoGo months', () => {
  it('lists 12 Exercice months with CDI/CDD ok vs NoGo, mix and billed CA', () => {
    const result = buildPilotage(
      [
        pilotageLine({
          id: 'cdi-ok',
          placementContractType: 'CDI',
          amountHt: 10_000,
          marge: 2_000,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
        pilotageLine({
          id: 'cdi-nogo',
          placementContractType: 'CDI',
          amountHt: 0,
          marge: 0,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
        pilotageLine({
          id: 'cdd-ok',
          placementContractType: 'CDD',
          amountHt: 4_000,
          marge: 800,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
      ],
      [],
      { exercice: '2025' },
      now,
    )
    expect(result.goNoGo.months).toHaveLength(12)
    expect(result.goNoGo.months[0]).toMatchObject({
      month: '2025-10',
      cdiOk: 0,
      cdiNogo: 0,
      cddOk: 0,
      cddNogo: 0,
      mixPct: 0,
      billedCa: 0,
    })
    expect(result.goNoGo.months.find((row) => row.month === '2026-08')).toMatchObject({
      month: '2026-08',
      cdiOk: 1,
      cdiNogo: 1,
      cddOk: 1,
      cddNogo: 0,
      mixPct: 66.7,
      billedCa: 14_000,
    })
  })

  it('lists the three months with most NoGo and months at 100 % conversion', () => {
    const at = (id: string, month: string, extra: Partial<ReturnType<typeof pilotageLine>>) =>
      pilotageLine({
        id,
        occurredAt: new Date(`${month}-01T00:00:00Z`),
        ...extra,
      })
    const result = buildPilotage(
      [
        at('apr-1', '2026-04', { placementContractType: 'CDI', amountHt: 0, marge: 0 }),
        at('apr-2', '2026-04', { placementContractType: 'CDD', amountHt: 0, marge: 0 }),
        at('apr-3', '2026-04', { placementContractType: 'CDI', cancelled: true }),
        at('aug-1', '2026-08', { placementContractType: 'CDI', amountHt: 0, marge: 0 }),
        at('aug-2', '2026-08', { placementContractType: 'CDD', amountHt: 0, marge: 0 }),
        at('jul-1', '2026-07', { placementContractType: 'CDD', amountHt: 0, marge: 0 }),
        at('jun-ok', '2026-06', { placementContractType: 'CDI', amountHt: 8_000, marge: 2_000 }),
      ],
      [],
      { exercice: '2025' },
      now,
    )
    expect(result.goNoGo.topNogo).toEqual([
      { month: '2026-04', label: 'Avril 2026', nogo: 3 },
      { month: '2026-08', label: 'Août 2026', nogo: 2 },
      { month: '2026-07', label: 'Juillet 2026', nogo: 1 },
    ])
    expect(result.goNoGo.fullConversion).toEqual([{ month: '2026-06', label: 'Juin 2026' }])
  })

  it('states the NoGo method in the caption', () => {
    expect(PILOTAGE_GOGO_CAPTION).toContain('Placement annulé ou CA 0 et Marge 0')
    expect(PILOTAGE_GOGO_CAPTION).toContain('même type')
    expect(PILOTAGE_GOGO_CAPTION).toContain('intérim n’est jamais NoGo')
  })
})
