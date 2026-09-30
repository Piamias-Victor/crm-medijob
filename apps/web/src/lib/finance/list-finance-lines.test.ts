import { describe, expect, it } from 'vitest'
import { listFinanceLines } from '@/lib/finance/list-finance-lines'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

function line(overrides: Partial<Parameters<typeof pilotageLine>[0]> & { id: string }) {
  return pilotageLine(overrides)
}

describe('listFinanceLines', () => {
  it('lists Placement lines only, never Intérim or orphan Devis', () => {
    const rows = listFinanceLines(
      [
        line({ id: 'place', kind: 'PLACEMENT' }),
        line({ id: 'interim', kind: 'INTERIM', placementContractType: null }),
      ],
      { kind: 'PLACEMENT' },
    )
    expect(rows.map((row) => row.financeLineId)).toEqual(['place'])
    expect(rows[0]?.lineKind).toBe('PLACEMENT')
  })

  it('shows JobTitle from the Candidate', () => {
    const rows = listFinanceLines([line({ id: 'jt', jobTitle: 'Pharmacien' })], {
      kind: 'PLACEMENT',
    })
    expect(rows[0]?.jobTitle).toBe('Pharmacien')
  })

  it('filters Placement lines by search on pharmacy, candidate or JobTitle', () => {
    const rows = listFinanceLines(
      [
        line({ id: 'a', pharmacyName: 'Pharma Nord', candidateName: 'Ada', jobTitle: 'Pharmacien' }),
        line({ id: 'b', pharmacyName: 'Pharma Sud', candidateName: 'Bob', jobTitle: 'Préparateur' }),
      ],
      { kind: 'PLACEMENT', search: 'nord' },
    )
    expect(rows.map((row) => row.financeLineId)).toEqual(['a'])
  })

  it('filters Placement lines by month of occurredAt', () => {
    const rows = listFinanceLines(
      [
        line({ id: 'aug', occurredAt: new Date('2026-08-15T00:00:00Z') }),
        line({ id: 'sep', occurredAt: new Date('2026-09-01T00:00:00Z') }),
      ],
      { kind: 'PLACEMENT', month: '2026-08' },
    )
    expect(rows.map((row) => row.financeLineId)).toEqual(['aug'])
  })

  it('filters Placement lines by CDD vs CDI', () => {
    const rows = listFinanceLines(
      [
        line({ id: 'cdd', placementContractType: 'CDD' }),
        line({ id: 'cdi', placementContractType: 'CDI' }),
      ],
      { kind: 'PLACEMENT', contractTypes: ['CDI'] },
    )
    expect(rows.map((row) => row.financeLineId)).toEqual(['cdi'])
  })

  it('keeps actifs only when cancelled is false', () => {
    const rows = listFinanceLines(
      [line({ id: 'ok' }), line({ id: 'lost', cancelled: true })],
      { kind: 'PLACEMENT', cancelled: false },
    )
    expect(rows.map((row) => row.financeLineId)).toEqual(['ok'])
  })

  it('filters unlinked lines when unlinkedOnly is true', () => {
    const rows = listFinanceLines(
      [
        line({ id: 'linked' }),
        line({
          id: 'orphan',
          pharmacyId: null,
          candidateId: null,
          pharmacyName: 'Excel Pharma',
          candidateName: 'Excel Candidat',
        }),
      ],
      { kind: 'PLACEMENT', unlinkedOnly: true },
    )
    expect(rows.map((row) => row.financeLineId)).toEqual(['orphan'])
  })

  it('filters by accepted date range', () => {
    const rows = listFinanceLines(
      [
        line({ id: 'jan', occurredAt: new Date('2026-01-15T00:00:00Z') }),
        line({ id: 'oct', occurredAt: new Date('2026-10-01T00:00:00Z') }),
      ],
      { kind: 'PLACEMENT', acceptedFrom: '2026-01-01', acceptedTo: '2026-09-30' },
    )
    expect(rows.map((row) => row.financeLineId)).toEqual(['jan'])
  })
})
