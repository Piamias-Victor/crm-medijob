import ExcelJS from 'exceljs'
import { parseSheetMonth } from '@/lib/finance/excel-import-sheet-month'
import { mapExcelDataRow } from '@/lib/finance/excel-import-map-row'
import type { ExcelParsedRow } from '@/lib/finance/excel-import-types'

export async function parseExcelWorkbook(
  buffer: ArrayBuffer | Buffer,
  sourceFile: 'suivi' | 'chiffre',
): Promise<{ rows: ExcelParsedRow[]; ignoredSheets: string[] }> {
  const wb = new ExcelJS.Workbook()
  // exceljs accepts Buffer
  await wb.xlsx.load(buffer as ExcelJS.Buffer)
  const rows: ExcelParsedRow[] = []
  const ignoredSheets: string[] = []
  for (const ws of wb.worksheets) {
    const sheet = parseSheetMonth(ws.name)
    if (!sheet) {
      ignoredSheets.push(ws.name)
      continue
    }
    const matrix: unknown[][] = []
    ws.eachRow({ includeEmpty: false }, (row) => {
      matrix.push(row.values as unknown[])
    })
    if (matrix.length < 2) continue
    // exceljs row.values is 1-indexed (index 0 empty)
    const headers = (matrix[0] ?? []).slice(1).map((c) => String(c ?? ''))
    for (let i = 1; i < matrix.length; i += 1) {
      const cells = (matrix[i] ?? []).slice(1)
      const parsed = mapExcelDataRow({
        cells,
        headers,
        sheetRowNumber: i + 1,
        sheet,
        sheetName: ws.name,
        sourceFile,
      })
      if (parsed) rows.push(parsed)
    }
  }
  return { rows, ignoredSheets }
}
