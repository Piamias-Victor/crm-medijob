import type { FilterConfig } from '@/lib/filters/filter-types'
import { exerciceFilterOptions } from '@/view-models/facturation-exercice'
import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'

type Ref = { id: string; name: string }

export function buildPilotageFilterConfig(recruiters: Ref[], now = new Date()) {
  return [
    {
      id: 'exercice',
      label: 'Exercice',
      type: 'select',
      options: exerciceFilterOptions(now),
    },
    {
      id: 'referent',
      label: 'Référent',
      type: 'select',
      options: buildReferentFilterOptions(recruiters),
      placeholder: 'Tous',
    },
  ] as const satisfies readonly FilterConfig[]
}

export type PilotageFilterConfig = ReturnType<typeof buildPilotageFilterConfig>
