import type { FilterConfig } from '@/lib/filters/filter-types'

export const APP_PROFILE_FILTER_CONFIG = [
  {
    id: 'q',
    label: 'Recherche',
    type: 'text',
    placeholder: 'Nom, email, tél, ville…',
    wide: true,
  },
] as const satisfies readonly FilterConfig[]

export type AppProfileFilterConfig = typeof APP_PROFILE_FILTER_CONFIG
