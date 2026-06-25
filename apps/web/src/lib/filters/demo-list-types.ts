import type { FilterConfig, FilterValues } from '@/lib/filters/filter-types'

export const demoFilterConfig = [
  {
    id: 'metier',
    label: 'Métier',
    type: 'multi-select',
    unit: 'métiers',
    options: [
      { value: 'pharmacien', label: 'Pharmacien' },
      { value: 'preparateur', label: 'Préparateur' },
    ],
  },
  {
    id: 'departement',
    label: 'Département',
    type: 'multi-select',
    unit: 'dpt',
    options: [
      { value: '69', label: '69 — Rhône' },
      { value: '75', label: '75 — Paris' },
    ],
  },
  {
    id: 'contrat',
    label: 'Contrat',
    type: 'multi-select',
    unit: 'types',
    options: [
      { value: 'cdi', label: 'CDI' },
      { value: 'cdd', label: 'CDD' },
      { value: 'interim', label: 'Intérim' },
    ],
  },
  { id: 'incomplete', label: 'Incomplet', type: 'boolean' },
] as const satisfies readonly FilterConfig[]

export type DemoFilterConfig = typeof demoFilterConfig
export type DemoListFilters = FilterValues<DemoFilterConfig>

export type DemoListRow = {
  id: string
  name: string
  city: string
  departement: string
  metier: string
  contrats: string[]
  createdAt: Date
  ca: number
  incomplete: boolean
}
