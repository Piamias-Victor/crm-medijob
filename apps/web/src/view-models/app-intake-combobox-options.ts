import {
  APP_CALL_OUTCOMES,
  APP_INTAKE_STATUSES,
} from '@/view-models/app-profile-intake.enums'
import {
  APP_CALL_OUTCOME_LABELS,
  APP_INTAKE_STATUS_LABELS,
} from '@/view-models/app-profile-intake.labels'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { buildReferentSelectOptions } from '@/view-models/referent-select-options'
import type { ComboboxOption } from '@/components/molecules/Combobox'

export const INTAKE_STATUS_OPTIONS: ComboboxOption[] = APP_INTAKE_STATUSES.map((value) => ({
  value,
  label: APP_INTAKE_STATUS_LABELS[value],
}))

export const CALL_OUTCOME_OPTIONS: ComboboxOption[] = [
  { value: '', label: TABLE_EMPTY_CELL },
  ...APP_CALL_OUTCOMES.map((value) => ({
    value,
    label: APP_CALL_OUTCOME_LABELS[value],
  })),
]

export function referentComboboxOptions(
  recruiters: readonly { id: string; name: string }[],
): ComboboxOption[] {
  return buildReferentSelectOptions(recruiters).map((opt) => ({
    value: opt.value,
    label: opt.value ? opt.label : TABLE_EMPTY_CELL,
  }))
}

export const INTAKE_CELL_COMBOBOX_CLASS = 'min-w-[8.5rem] max-w-[11rem] px-2 py-1 text-xs'
