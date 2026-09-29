import type { ExcelParsedRow } from '@/lib/finance/excel-import-types'
import { buildImportKey } from '@/lib/finance/excel-import-key'
import { matchExcelLabels, type MatchCatalog } from '@/lib/finance/excel-import-match'

export type PreparedImportRow = ExcelParsedRow & {
  importKey: string
  pharmacyId: string | null
  candidateId: string | null
  referentId: string | null
  referentLabelResolved: string
}

export function prepareImportRows(
  rows: ExcelParsedRow[],
  catalog: MatchCatalog,
): PreparedImportRow[] {
  return rows.map((row) => {
    const matched = matchExcelLabels(
      {
        pharmacyLabel: row.pharmacyLabel,
        candidateLabel: row.candidateLabel,
        referentLabel: row.referentLabel,
      },
      catalog,
    )
    return {
      ...row,
      importKey: buildImportKey({
        exercice: row.exercice,
        month: row.month,
        sheetRowNumber: row.sheetRowNumber,
        pharmacyLabel: row.pharmacyLabel,
        candidateLabel: row.candidateLabel,
      }),
      pharmacyId: matched.pharmacyId,
      candidateId: matched.candidateId,
      referentId: matched.referentId,
      referentLabelResolved: matched.referentLabel,
    }
  })
}
