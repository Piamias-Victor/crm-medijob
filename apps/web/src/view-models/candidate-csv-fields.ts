export const CANDIDATE_CSV_REQUIRED_FIELDS = ['firstName', 'lastName', 'jobTitle'] as const

export const CANDIDATE_CSV_OPTIONAL_FIELDS = [
  'email',
  'phone',
  'address',
  'city',
  'postalCode',
  'status',
  'mobilityRadiusKm',
  'salaryExpectations',
  'notes',
] as const

export const CANDIDATE_CSV_FIELDS = [
  ...CANDIDATE_CSV_REQUIRED_FIELDS,
  ...CANDIDATE_CSV_OPTIONAL_FIELDS,
] as const

export type CandidateCsvField = (typeof CANDIDATE_CSV_FIELDS)[number]

export const CANDIDATE_CSV_FIELD_LABELS: Record<CandidateCsvField, string> = {
  firstName: 'Prénom',
  lastName: 'Nom',
  email: 'Email',
  phone: 'Téléphone',
  address: 'Adresse',
  city: 'Ville',
  postalCode: 'Code postal',
  jobTitle: 'Métier',
  status: 'Statut',
  mobilityRadiusKm: 'Mobilité (km)',
  salaryExpectations: 'Prétentions',
  notes: 'Notes',
}
