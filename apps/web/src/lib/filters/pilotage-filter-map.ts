import type { PilotageFilters } from '@/view-models/facturation-pilotage-filters.schema'

export function toPilotageFilters(values: { exercice: string; referent: string }): PilotageFilters {
  return {
    exercice: values.exercice || undefined,
    ...(values.referent ? { referentId: values.referent } : {}),
  }
}
