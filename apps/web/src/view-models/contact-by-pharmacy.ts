import { DEFAULT_LIST_LIMIT } from '@/lib/list-limits'

export type ContactRef = { id: string; label: string }

type ContactRow = {
  id: string
  firstName: string
  lastName: string
  pharmacyId: string
}

function toContactRef(row: Pick<ContactRow, 'id' | 'firstName' | 'lastName'>): ContactRef {
  return { id: row.id, label: `${row.firstName} ${row.lastName}`.trim() }
}

export function groupContactsByPharmacy(
  rows: ContactRow[],
  limitPerPharmacy = DEFAULT_LIST_LIMIT,
): Record<string, ContactRef[]> {
  const grouped: Record<string, ContactRef[]> = {}
  for (const row of rows) {
    const list = grouped[row.pharmacyId] ?? (grouped[row.pharmacyId] = [])
    if (list.length < limitPerPharmacy) list.push(toContactRef(row))
  }
  return grouped
}
