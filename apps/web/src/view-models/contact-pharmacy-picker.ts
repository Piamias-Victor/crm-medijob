export type ContactPharmacyPickerRow = {
  id: string
  label: string
  email: string
  isPrimary: boolean
}

type ContactEntity = {
  id: string
  firstName: string
  lastName: string
  email: string | null
  isPrimary: boolean
}

export function toContactPharmacyPickerRow(contact: ContactEntity): ContactPharmacyPickerRow | null {
  const email = contact.email?.trim() ?? ''
  if (!email) return null

  return {
    id: contact.id,
    label: `${contact.firstName} ${contact.lastName}`.trim(),
    email,
    isPrimary: contact.isPrimary,
  }
}

export function mapContactPharmacyPickerRows(contacts: ContactEntity[]): ContactPharmacyPickerRow[] {
  return contacts
    .map(toContactPharmacyPickerRow)
    .filter((row): row is ContactPharmacyPickerRow => row !== null)
    .sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary))
}

export function defaultContactPharmacyPickerId(rows: ContactPharmacyPickerRow[]): string | undefined {
  return rows.find((row) => row.isPrimary)?.id ?? rows[0]?.id
}
