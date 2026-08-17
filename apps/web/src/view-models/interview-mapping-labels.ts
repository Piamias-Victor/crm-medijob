import type { InterviewMappingField } from '@/view-models/interview-mapping-types'

export const INTERVIEW_MAPPING_FIELD_LABELS: Record<InterviewMappingField, string> = {
  availableFrom: 'Disponibilité',
  mobilityRadiusKm: 'Rayon de mobilité (km)',
  salaryExpectations: 'Prétentions salariales',
  notes: 'Notes',
  softwareNames: 'Logiciels',
  contractTypes: 'Types de contrat',
}

export function formatMappingValue(value: unknown): string {
  if (value == null) return '—'
  if (value instanceof Date) return value.toLocaleDateString('fr-FR')
  if (Array.isArray(value)) return value.length ? value.join(', ') : '—'
  return String(value)
}
