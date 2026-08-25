import { buildDefaultFilterValues } from '@/lib/filters/filter-types'
import { currentExerciceStartYear } from '@/view-models/facturation-exercice'
import type { PilotageFilterConfig } from '@/lib/filters/pilotage-filter-config'

export function buildPilotageFilterDefaults(config: PilotageFilterConfig, now = new Date()) {
  return {
    ...buildDefaultFilterValues(config),
    exercice: String(currentExerciceStartYear(now)),
  }
}
