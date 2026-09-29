import { describe, expect, it } from 'vitest'
import { prepareImportRows } from '@/lib/finance/excel-import-prepare'
import { applyExcelImport } from '@/lib/finance/excel-import-apply'
import { buildImportDryRunMarkdown } from '@/lib/finance/excel-import-report'
import type { ExcelParsedRow } from '@/lib/finance/excel-import-types'
import type { PreparedImportRow } from '@/lib/finance/excel-import-prepare'

function row(n: number): ExcelParsedRow {
  return {
    sourceFile: 'suivi',
    sheetName: 'OCTOBRE 25',
    sheetRowNumber: n,
    exercice: '25/26',
    month: '2025-10',
    occurredAt: new Date('2025-10-01T00:00:00Z'),
    kind: 'INTERIM',
    placementContractType: null,
    candidateLabel: `Cand${n}`,
    pharmacyLabel: `Pharm${n}`,
    referentLabel: '',
    amountHt: 100 * n,
    marge: 10 * n,
    hours: 2,
    invoiced: false,
    paid: false,
    zeroCa: false,
  }
}

describe('excel import apply', () => {
  it('second apply creates 0 rows (skip importKey)', async () => {
    const prepared = prepareImportRows([row(1), row(2)], {
      pharmacies: [],
      candidates: [],
      users: [],
    })
    const store = new Map<string, PreparedImportRow>()
    const deps = {
      listExistingImportKeys: async () => new Set(store.keys()),
      createMany: async (rows: PreparedImportRow[]) => {
        for (const r of rows) store.set(r.importKey, r)
        return rows.length
      },
    }
    const first = await applyExcelImport(prepared, { ignoredOverlap: 0, ignoredSheets: 1 }, deps)
    expect(first.created).toBe(2)
    const second = await applyExcelImport(prepared, { ignoredOverlap: 0, ignoredSheets: 1 }, deps)
    expect(second.created).toBe(0)
    expect(second.plan.counts.alreadyPresent).toBe(2)
    const md = buildImportDryRunMarkdown(second.plan, '2026-09-29')
    expect(md).not.toMatch(/Cand1|Pharm1/)
    expect(md).toContain('already present')
  })
})
