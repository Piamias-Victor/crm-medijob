import { describe, expect, it } from 'vitest'
import { parseSheetMonth } from '@/lib/finance/excel-import-sheet-month'
import { mergeExcelSources } from '@/lib/finance/excel-import-merge'
import { buildAnonFinanceXlsx } from '@/lib/finance/excel-import-anon-fixture'
import { parseExcelWorkbook } from '@/lib/finance/excel-import-parse-workbook'
import type { ExcelParsedRow } from '@/lib/finance/excel-import-types'

function baseRow(partial: Partial<ExcelParsedRow> & Pick<ExcelParsedRow, 'month'>): ExcelParsedRow {
  return {
    sourceFile: 'suivi',
    sheetName: 'X',
    sheetRowNumber: 2,
    exercice: '25/26',
    occurredAt: new Date('2025-10-01T00:00:00Z'),
    kind: 'INTERIM',
    placementContractType: null,
    candidateLabel: 'Alpha',
    pharmacyLabel: 'Pharma A',
    referentLabel: '',
    amountHt: 100,
    marge: 20,
    hours: 5,
    invoiced: false,
    paid: false,
    zeroCa: false,
    ...partial,
  }
}

describe('excel import parser', () => {
  it('parses month sheet names to occurredAt first of month', () => {
    const oct = parseSheetMonth('OCTOBRE 25')
    expect(oct?.monthKey).toBe('2025-10')
    expect(oct?.occurredAt.toISOString().startsWith('2025-10-01')).toBe(true)
    expect(parseSheetMonth('OCTOBRE 2627')?.monthKey).toBe('2026-10')
    expect(parseSheetMonth('SAISIE')).toBeNull()
  })

  it('drops Suivi rows when CHIFFRE has the same month', () => {
    const report = mergeExcelSources(
      [baseRow({ month: '2026-10', amountHt: 1 }), baseRow({ month: '2025-11', amountHt: 2 })],
      [baseRow({ month: '2026-10', sourceFile: 'chiffre', amountHt: 9 })],
    )
    expect(report.ignoredOverlapSuivi).toBe(1)
    expect(report.rows.map((r) => r.amountHt).sort()).toEqual([2, 9])
  })

  it('parses anon workbook: empty CA→0, interim hours, ignores SAISIE', async () => {
    const buf = await buildAnonFinanceXlsx({
      sheets: [
        {
          name: 'OCTOBRE 25',
          rows: [
            { candidate: 'Alpha', pharmacy: 'Pharma A', type: 'INTÉRIM', hours: 10, ca: null, marge: null },
            { candidate: 'Beta', pharmacy: 'Pharma B', type: 'CDI', ca: 500, marge: 500, invoiced: true },
          ],
        },
        { name: 'SAISIE', rows: [{ candidate: 'Skip', pharmacy: 'X', type: 'CDD', ca: 999 }] },
      ],
    })
    const { rows, ignoredSheets } = await parseExcelWorkbook(buf, 'suivi')
    expect(ignoredSheets).toContain('SAISIE')
    expect(rows).toHaveLength(2)
    const interim = rows.find((r) => r.kind === 'INTERIM')
    expect(interim).toMatchObject({ amountHt: 0, zeroCa: true, hours: 10 })
    const placement = rows.find((r) => r.kind === 'PLACEMENT')
    expect(placement).toMatchObject({ amountHt: 500, placementContractType: 'CDI', invoiced: true })
  })
})
