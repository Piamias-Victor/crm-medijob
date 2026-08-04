import type { PharmacyInRadiusRow } from '@/view-models/present-candidate-radius'
import { formatPresentContactLabel } from '@/view-models/format-present-contact-label'

export function buildRadiusBcc(pharmacies: PharmacyInRadiusRow[], selectedIds: string[]) {
  const selected = new Set(selectedIds)
  const labels = pharmacies
    .filter((row) => selected.has(row.id))
    .map((row) =>
      formatPresentContactLabel({
        firstName: row.contactFirstName,
        lastName: row.contactLastName,
        email: row.email,
      }),
    )
  return [...new Set(labels)].join(',')
}
