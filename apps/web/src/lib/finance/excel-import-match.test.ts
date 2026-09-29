import { describe, expect, it } from 'vitest'
import { buildImportKey } from '@/lib/finance/excel-import-key'
import { firstReferentLabel, normalizeImportLabel } from '@/lib/finance/excel-import-normalize'
import { matchExcelLabels } from '@/lib/finance/excel-import-match'

describe('excel import matching', () => {
  it('builds stable importKey independent of file name', () => {
    const a = buildImportKey({
      exercice: '25/26',
      month: '2025-10',
      sheetRowNumber: 3,
      pharmacyLabel: 'Pharma A',
      candidateLabel: 'Alpha',
    })
    const b = buildImportKey({
      exercice: '25/26',
      month: '2025-10',
      sheetRowNumber: 3,
      pharmacyLabel: '  pharma a ',
      candidateLabel: 'ALPHA',
    })
    expect(a).toBe(b)
    expect(a).toHaveLength(64)
  })

  it('matches pharmacy/candidate exactly; co-credit uses first name pair', () => {
    expect(normalizeImportLabel('  Café ')).toBe('cafe')
    expect(firstReferentLabel('Alice Bob Carol Dan')).toBe('Alice Bob')
    const matched = matchExcelLabels(
      { pharmacyLabel: 'Pharma A', candidateLabel: 'Alpha Zulu', referentLabel: 'Alice Bob Carol' },
      {
        pharmacies: [{ id: 'p1', name: 'pharma a' }],
        candidates: [{ id: 'c1', firstName: 'Alpha', lastName: 'Zulu' }],
        users: [
          { id: 'u1', name: 'Alice Bob' },
          { id: 'u2', name: 'Carol Dan' },
        ],
      },
    )
    expect(matched).toEqual({
      pharmacyId: 'p1',
      candidateId: 'c1',
      referentId: 'u1',
      referentLabel: 'Alice Bob',
    })
  })

  it('leaves ids null when labels do not match', () => {
    const matched = matchExcelLabels(
      { pharmacyLabel: 'Unknown', candidateLabel: 'Nobody', referentLabel: '' },
      { pharmacies: [], candidates: [], users: [] },
    )
    expect(matched).toEqual({
      pharmacyId: null,
      candidateId: null,
      referentId: null,
      referentLabel: '',
    })
  })
})
