export const PHARMACY_CSV_OPTIONAL_FIELDS = [
  'siret',
  'address',
  'city',
  'postalCode',
  'phone',
  'email',
  'status',
  'notes',
] as const

export const PHARMACY_CSV_FIELDS = ['name', ...PHARMACY_CSV_OPTIONAL_FIELDS] as const

export type PharmacyCsvField = (typeof PHARMACY_CSV_FIELDS)[number]

export const PHARMACY_CSV_FIELD_LABELS: Record<PharmacyCsvField, string> = {
  name: 'Nom',
  siret: 'SIRET',
  address: 'Adresse',
  city: 'Ville',
  postalCode: 'Code postal',
  phone: 'Téléphone',
  email: 'Email',
  status: 'Statut',
  notes: 'Notes',
}
