import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

const now = new Date('2026-08-24T00:00:00Z')

describe('buildPilotage matrix', () => {
  it('gives each line to one Referent so matrix total equals agency CA', () => {
    const result = buildPilotage(
      [
        pilotageLine({
          id: 'a',
          amountHt: 5_000,
          marge: 1_500,
          referentId: 'u-alice',
          referentName: 'Alice',
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
        pilotageLine({
          id: 'b',
          kind: 'INTERIM',
          amountHt: 3_000,
          marge: 900,
          referentId: 'u-bob',
          referentName: 'Bob',
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
      ],
      [],
      { exercice: '2025' },
      now,
    )
    expect(result.kpis.ca).toBe(8_000)
    expect(result.matrix.total).toBe(8_000)
    expect(result.matrix.months).toHaveLength(12)
    expect(result.matrix.rows).toEqual([
      {
        referentId: 'u-alice',
        referentName: 'Alice',
        total: 5_000,
        values: expect.any(Array),
      },
      {
        referentId: 'u-bob',
        referentName: 'Bob',
        total: 3_000,
        values: expect.any(Array),
      },
    ])
    const aug = result.matrix.months.indexOf('2026-08')
    expect(result.matrix.rows[0]?.values[aug]).toBe(5_000)
    expect(result.matrix.rows[1]?.values[aug]).toBe(3_000)
  })

  it('buckets a line without Referent as Non attribué', () => {
    const result = buildPilotage(
      [
        pilotageLine({
          id: 'free',
          amountHt: 2_000,
          marge: 400,
          referentId: null,
          referentName: null,
        }),
      ],
      [],
      { exercice: 'all' },
    )
    expect(result.matrix.rows).toEqual([
      {
        referentId: null,
        referentName: '— Non attribué —',
        total: 2_000,
        values: [],
      },
    ])
    expect(result.matrix.total).toBe(result.kpis.ca)
  })
})
