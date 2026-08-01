import {
  pharmacyInputSchema,
  type PharmacyInput,
} from '@/view-models/pharmacy-form.schema'
import { toPharmacyFormValues, type PharmacyFormSource } from '@/view-models/pharmacy-form'
import { STATUS_LABELS } from '@/lib/pharmacy-options'

export type PharmacyDuplicateRow = Record<string, unknown> & {
  name: string
  siret: string
  address: string
  city: string
  postalCode: string
  phone: string
  email: string
  status: string
  notes: string
}

function emptyRow(): PharmacyDuplicateRow {
  return {
    name: '',
    siret: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    status: 'PROSPECT',
    notes: '',
  }
}

export function toPharmacyDuplicateRowFromInput(data: PharmacyInput): PharmacyDuplicateRow {
  return {
    ...emptyRow(),
    name: data.name,
    siret: data.siret ?? '',
    address: data.address ?? '',
    city: data.city ?? '',
    postalCode: data.postalCode ?? '',
    phone: data.phone ?? '',
    email: data.email ?? '',
    status: data.status ?? 'PROSPECT',
    notes: data.notes ?? '',
  }
}

export function toPharmacyDuplicateRowFromFormSource(source: PharmacyFormSource): PharmacyDuplicateRow {
  return toPharmacyDuplicateRowFromInput(
    pharmacyInputSchema.parse(toPharmacyFormValues(source)),
  )
}

export function toPharmacyInputFromDuplicateRow(row: PharmacyDuplicateRow): PharmacyInput {
  return pharmacyInputSchema.parse({
    name: row.name,
    siret: row.siret || undefined,
    address: row.address || undefined,
    city: row.city || undefined,
    postalCode: row.postalCode || undefined,
    phone: row.phone || undefined,
    email: row.email || undefined,
    status: row.status,
    notes: row.notes || undefined,
  })
}

export function pharmacyStatusLabel(status: string): string {
  if (status in STATUS_LABELS) {
    return STATUS_LABELS[status as keyof typeof STATUS_LABELS]
  }
  return status || '—'
}
