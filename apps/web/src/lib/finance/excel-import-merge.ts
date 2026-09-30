import type { ExcelParsedRow, ExcelParseReport } from '@/lib/finance/excel-import-types'

/** CHIFFRE wins entire overlapping months; Suivi rows for those months are dropped. */
export function mergeExcelSources(
  suivi: ExcelParsedRow[],
  chiffre: ExcelParsedRow[],
): ExcelParseReport {
  const chiffreMonths = new Set(chiffre.map((r) => r.month))
  let ignoredOverlapSuivi = 0
  const keptSuivi = suivi.filter((r) => {
    if (chiffreMonths.has(r.month)) {
      ignoredOverlapSuivi += 1
      return false
    }
    return true
  })
  return {
    rows: [...keptSuivi, ...chiffre],
    ignoredOverlapSuivi,
    ignoredSheets: [],
  }
}
