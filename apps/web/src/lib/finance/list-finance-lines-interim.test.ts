import { describe, expect, it } from 'vitest'
import { listFinanceLines } from '@/lib/finance/list-finance-lines'
import { pilotageLine } from '@/view-models/facturation-pilotage.test.fixtures'

const interimLine = pilotageLine({
  id: 'line-i',
  kind: 'INTERIM',
  hours: 12,
  hourlyRate: 40,
  amountHt: 480,
  htSource: 'ENGINE',
  marge: 120,
  referentId: null,
  referentName: null,
  placementContractType: null,
})

describe('listFinanceLines Intérim hours', () => {
  it('exposes hours already stored on the Ligne de suivi', () => {
    const rows = listFinanceLines([interimLine], { kind: 'INTERIM' })
    expect(rows[0]).toMatchObject({ financeLineId: 'line-i', hours: 12 })
  })
})
