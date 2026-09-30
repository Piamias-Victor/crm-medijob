import ExcelJS from 'exceljs'

const HEADER = [
  'Candidat',
  'Pharmacie',
  'Type ',
  'Fonction',
  'Date Début ',
  'Date Fin',
  "NBR d'heure",
  'Recruteur',
  "Chiffre d'Affaire",
  'Marge Brute INT',
  'FACT ',
  'Contrats ',
  'Facturé',
  'Payé',
]

/** Anonymized tiny workbook for tests — never use real names. */
export async function buildAnonFinanceXlsx(input: {
  sheets: Array<{
    name: string
    rows: Array<{
      candidate: string
      pharmacy: string
      type: string
      hours?: number | string
      ca?: number | null
      marge?: number | null
      invoiced?: boolean
      paid?: boolean
    }>
  }>
}): Promise<Buffer> {
  const wb = new ExcelJS.Workbook()
  for (const sheet of input.sheets) {
    const ws = wb.addWorksheet(sheet.name)
    ws.addRow(HEADER)
    for (const r of sheet.rows) {
      ws.addRow([
        r.candidate,
        r.pharmacy,
        r.type,
        'Role',
        null,
        null,
        r.hours ?? null,
        null,
        r.ca ?? null,
        r.marge ?? null,
        null,
        false,
        r.invoiced ?? false,
        r.paid ?? false,
      ])
    }
  }
  const buf = await wb.xlsx.writeBuffer()
  return Buffer.from(buf)
}
