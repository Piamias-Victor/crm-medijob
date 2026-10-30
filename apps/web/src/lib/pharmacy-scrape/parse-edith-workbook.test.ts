import { describe, expect, it } from 'vitest'
import ExcelJS from 'exceljs'
import { parseEdithPharmacyScrapeWorkbook } from '@/lib/pharmacy-scrape/parse-edith-workbook'

async function bufferWithRows(rows: unknown[][]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Base MEDIJOB')
  for (const row of rows) ws.addRow(row)
  const ab = await wb.xlsx.writeBuffer()
  return Buffer.from(ab)
}

describe('parseEdithPharmacyScrapeWorkbook', () => {
  it('parses the first sheet with EDITH headers into mapped rows', async () => {
    const buf = await bufferWithRows([
      ['Provenance', 'Date', 'Nom', 'CP', 'Ville', 'Mail'],
      ['Globale', new Date('2025-06-01'), 'PHARMA A', '69', 'LYON', 'a@ex.com'],
      ['OCP', new Date('2025-06-01'), 'PHARMA B', '75001', 'PARIS', 'b@ex.com'],
    ])
    const result = await parseEdithPharmacyScrapeWorkbook(buf)
    expect(result.skipped).toEqual([])
    expect(result.rows).toHaveLength(2)
    expect(result.rows[0]?.department).toBe('69')
    expect(result.rows[1]?.department).toBe('75')
  })

  it('throws when headers are not EDITH', async () => {
    const buf = await bufferWithRows([
      ['Name', 'Email'],
      ['X', 'a@ex.com'],
    ])
    await expect(parseEdithPharmacyScrapeWorkbook(buf)).rejects.toThrow(/format EDITH/i)
  })
})
