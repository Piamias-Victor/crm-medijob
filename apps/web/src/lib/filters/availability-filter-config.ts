import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

const PERIOD_OPTIONS = [
  { value: 'AM', label: 'Matin' },
  { value: 'PM', label: 'Après-midi' },
] as const

const DISPO_OPTIONS = [
  { value: 'all', label: 'Tous' },
  { value: 'yes', label: 'Dispos renseignées' },
  { value: 'no', label: 'Sans dispo' },
] as const

export function buildAvailabilityFilterConfig(jobTitles: { id: string; name: string }[]) {
  return [
    { id: 'q', type: 'text', label: 'Recherche', placeholder: 'Nom, ville…', wide: true },
    {
      id: 'metier',
      type: 'multi-select',
      label: 'Métier',
      options: jobTitles.map((jobTitle) => ({ value: jobTitle.id, label: jobTitle.name })),
      unit: 'métiers',
    },
    {
      id: 'dispos',
      type: 'select',
      label: 'Dispos',
      options: DISPO_OPTIONS,
      placeholder: 'Tous',
    },
    { id: 'dates', type: 'date-range', label: 'Période' },
    { id: 'creneau', type: 'select', label: 'Créneau', options: PERIOD_OPTIONS, placeholder: 'Tous' },
    { id: 'ville', type: 'text', label: 'Ville', placeholder: 'Ville de l’officine' },
    { id: 'rayon', type: 'text', label: 'Rayon (km)', placeholder: '30' },
  ] as const satisfies readonly FilterConfig[]
}

export type AvailabilityFilterConfig = ReturnType<typeof buildAvailabilityFilterConfig>
export type AvailabilityFilterValues = FilterValues<AvailabilityFilterConfig>

export const AVAILABILITY_ADVANCED_FILTER_IDS = ['ville', 'rayon'] as const
