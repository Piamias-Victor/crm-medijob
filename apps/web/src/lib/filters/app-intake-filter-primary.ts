import { buildReferentFilterOptions } from '@/lib/filters/referent-filter-options'
import {
  APP_CALL_OUTCOMES,
  APP_INTAKE_STATUSES,
} from '@/view-models/app-profile-intake.enums'
import {
  APP_CALL_OUTCOME_LABELS,
  APP_INTAKE_STATUS_LABELS,
} from '@/view-models/app-profile-intake.labels'

type Ref = { id: string; name: string }

export function appIntakePrimaryFilters(recruiters: readonly Ref[]) {
  return [
    {
      id: 'q' as const,
      label: 'Recherche',
      type: 'text' as const,
      placeholder: 'Nom, email, tél, notes, comments…',
      wide: true,
    },
    {
      id: 'referentScope' as const,
      label: 'Périmètre',
      type: 'select' as const,
      placeholder: 'Moi + non assignés',
      options: [
        { value: '', label: 'Moi + non assignés' },
        { value: 'all', label: 'Voir tous' },
      ],
    },
    {
      id: 'population' as const,
      label: 'File',
      type: 'select' as const,
      placeholder: 'À traiter',
      options: [
        { value: '', label: 'À traiter' },
        { value: 'archive', label: 'Archives / refusés' },
      ],
    },
    {
      id: 'intakeStatus' as const,
      label: 'Statut',
      type: 'multi-select' as const,
      unit: 'statuts',
      options: APP_INTAKE_STATUSES.map((value) => ({
        value,
        label: APP_INTAKE_STATUS_LABELS[value],
      })),
    },
    {
      id: 'callOutcome' as const,
      label: 'Appel',
      type: 'multi-select' as const,
      unit: 'résultats',
      options: APP_CALL_OUTCOMES.map((value) => ({
        value,
        label: APP_CALL_OUTCOME_LABELS[value],
      })),
    },
    {
      id: 'referent' as const,
      label: 'Référent',
      type: 'multi-select' as const,
      unit: 'référents',
      options: buildReferentFilterOptions(recruiters),
    },
  ]
}
