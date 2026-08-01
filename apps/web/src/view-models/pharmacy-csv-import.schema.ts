import { z } from 'zod'
import { pharmacyInputSchema } from '@/view-models/pharmacy-form.schema'
import { parsePharmacyCsvStatus } from '@/view-models/pharmacy-csv-status'

const optionalHeader = z.string().trim().min(1).optional()

export const pharmacyCsvColumnMapSchema = z.object({
  name: z.string().trim().min(1, 'Colonne nom requise'),
  siret: optionalHeader,
  address: optionalHeader,
  city: optionalHeader,
  postalCode: optionalHeader,
  phone: optionalHeader,
  email: optionalHeader,
  status: optionalHeader,
  notes: optionalHeader,
})

export type PharmacyCsvColumnMap = z.infer<typeof pharmacyCsvColumnMapSchema>
export type PharmacyCsvImportRow = z.output<typeof pharmacyInputSchema>

export type PharmacyCsvRowError = { row: number; message: string }

function cellAt(headers: string[], cells: string[], header: string | undefined): string | undefined {
  if (!header) return undefined
  const index = headers.indexOf(header)
  if (index < 0) return undefined
  return cells[index]
}

function rowPayload(headers: string[], cells: string[], map: PharmacyCsvColumnMap) {
  const statusRaw = cellAt(headers, cells, map.status)
  const status = parsePharmacyCsvStatus(statusRaw)
  return {
    name: cellAt(headers, cells, map.name) ?? '',
    siret: cellAt(headers, cells, map.siret),
    address: cellAt(headers, cells, map.address),
    city: cellAt(headers, cells, map.city),
    postalCode: cellAt(headers, cells, map.postalCode),
    phone: cellAt(headers, cells, map.phone),
    email: cellAt(headers, cells, map.email),
    notes: cellAt(headers, cells, map.notes),
    ...(status ? { status } : {}),
  }
}

function statusError(
  headers: string[],
  cells: string[],
  map: PharmacyCsvColumnMap,
): string | null {
  const statusRaw = cellAt(headers, cells, map.status)
  if (!statusRaw?.trim()) return null
  return parsePharmacyCsvStatus(statusRaw) ? null : 'Statut invalide'
}

export function mapPharmacyCsvRows(
  headers: string[],
  dataRows: string[][],
  map: PharmacyCsvColumnMap,
): { rows: PharmacyCsvImportRow[]; errors: PharmacyCsvRowError[] } {
  const rows: PharmacyCsvImportRow[] = []
  const errors: PharmacyCsvRowError[] = []
  dataRows.forEach((cells, index) => {
    const row = index + 2
    const statusMsg = statusError(headers, cells, map)
    if (statusMsg) {
      errors.push({ row, message: statusMsg })
      return
    }
    const parsed = pharmacyInputSchema.safeParse(rowPayload(headers, cells, map))
    if (!parsed.success) {
      errors.push({ row, message: parsed.error.issues[0]?.message ?? 'Ligne invalide' })
      return
    }
    rows.push(parsed.data)
  })
  return { rows, errors }
}
