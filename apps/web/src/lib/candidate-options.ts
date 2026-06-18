import { CONTRACT_TYPES } from '@/view-models/candidate-profile.schema'

export const CONTRACT_TYPE_LABELS: Record<(typeof CONTRACT_TYPES)[number], string> = {
  CDI: 'CDI',
  CDD: 'CDD',
  INTERIM: 'Intérim',
  VACATION: 'Vacation',
}

export const MATCHING_FIELD_LABELS: Record<string, string> = {
  city: 'Ville',
  postalCode: 'Code postal',
  mobilityRadiusKm: 'Rayon de mobilité',
  availableFrom: 'Disponibilité',
}
