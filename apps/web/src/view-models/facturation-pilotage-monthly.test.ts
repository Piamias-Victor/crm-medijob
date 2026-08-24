import { describe, expect, it } from 'vitest'
import { buildPilotage } from '@/view-models/facturation-pilotage'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

const now = new Date('2026-08-24T00:00:00Z')

describe('buildPilotage monthly table', () => {
  it('lists 12 months with placements vs intérim, CA split and Marge', () => {
    const result = buildPilotage(
      [
        pilotageLine({
          id: 'p',
          amountHt: 5_000,
          marge: 1_500,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
        pilotageLine({
          id: 'i',
          kind: 'INTERIM',
          amountHt: 3_000,
          marge: 900,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
      ],
      [],
      { exercice: '2025' },
      now,
    )
    expect(result.monthly).toHaveLength(12)
    expect(result.monthly[0]).toMatchObject({
      month: '2025-10',
      placements: 0,
      interim: 0,
      caPlacement: 0,
      caInterim: 0,
      ca: 0,
      marge: 0,
    })
    expect(result.monthly.find((row) => row.month === '2026-08')).toMatchObject({
      month: '2026-08',
      placements: 1,
      interim: 1,
      caPlacement: 5_000,
      caInterim: 3_000,
      ca: 8_000,
      marge: 2_400,
    })
  })

  it('puts that month’s lines on the row for click detail', () => {
    const result = buildPilotage(
      [
        pilotageLine({
          id: 'aug-p',
          amountHt: 5_000,
          marge: 1_500,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
        pilotageLine({
          id: 'aug-i',
          kind: 'INTERIM',
          amountHt: 3_000,
          marge: 900,
          occurredAt: new Date('2026-08-01T00:00:00Z'),
        }),
        pilotageLine({
          id: 'jul-p',
          amountHt: 2_000,
          marge: 400,
          occurredAt: new Date('2026-07-01T00:00:00Z'),
        }),
      ],
      [],
      { exercice: '2025' },
      now,
    )
    expect(result.monthly.find((row) => row.month === '2026-08')?.lines).toEqual([
      expect.objectContaining({
        id: 'aug-p',
        pharmacyName: 'Pharma Nord',
        candidateName: 'Ada',
        ca: 5_000,
        marge: 1_500,
      }),
      expect.objectContaining({ id: 'aug-i', ca: 3_000, pole: 'interim' }),
    ])
    expect(result.monthly.find((row) => row.month === '2026-07')?.lines).toEqual([
      expect.objectContaining({ id: 'jul-p', ca: 2_000 }),
    ])
  })
})
