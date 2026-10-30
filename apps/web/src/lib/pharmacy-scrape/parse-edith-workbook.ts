import ExcelJS from 'exceljs'
import { assertEdithHeaders } from '@/view-models/pharmacy-scrape-edith-headers'
import {
  mapPharmacyScrapeEdithRows,
  type EdithRawRow,
  type MapPharmacyScrapeResult,
} from '@/view-models/pharmacy-scrape-map-rows'

function cellValue(value: ExcelJS.CellValue): string | number | Date | undefined {
  if (value == null || value === '') return undefined
  if (value instanceof Date) return value
  if (typeof value === 'number' || typeof value === 'string') return value
  if (typeof value === 'object' && 'result' in value) {
    return cellValue(value.result as ExcelJS.CellValue)
  }
  if (typeof value === 'object' && 'text' in value) {
    return String((value as { text: string }).text)
  }
  return String(value)
}

export async function parseEdithPharmacyScrapeWorkbook(
  buffer: ArrayBuffer | Buffer,
): Promise<MapPharmacyScrapeResult> {
  const wb = new ExcelJS.Workbook()
  await wb.xlsx.load(buffer as ExcelJS.Buffer)
  const ws = wb.worksheets[0]
  if (!ws) throw new Error('Fichier Excel vide')

  const matrix: ExcelJS.CellValue[][] = []
  ws.eachRow({ includeEmpty: false }, (row) => {
    matrix.push((row.values as ExcelJS.CellValue[]).slice(1))
  })
  if (matrix.length < 2) throw new Error('Aucune ligne de données')

  const headers = (matrix[0] ?? []).map((c) => String(cellValue(c) ?? ''))
  assertEdithHeaders(headers)

  const rawRows: EdithRawRow[] = matrix.slice(1).map((cells) => ({
    Provenance: String(cellValue(cells[0]) ?? ''),
    Date: cellValue(cells[1]),
    Nom: String(cellValue(cells[2]) ?? ''),
    CP: cellValue(cells[3]),
    Ville: String(cellValue(cells[4]) ?? ''),
    Mail: String(cellValue(cells[5]) ?? ''),
  }))

  return mapPharmacyScrapeEdithRows(rawRows)
}
