import type { ComboboxOption } from '@/components/molecules/Combobox'
import {
  APP_CALL_OUTCOMES,
} from '@/view-models/app-profile-intake.enums'
import { APP_CALL_OUTCOME_LABELS } from '@/view-models/app-profile-intake.labels'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { buildReferentSelectOptions } from '@/view-models/referent-select-options'

export type IntakeStatusOption = { id: string; name: string; color: string }

export function buildIntakeStatusOptions(
  statuses: readonly IntakeStatusOption[],
): ComboboxOption[] {
  return statuses.map((status) => ({
    value: status.id,
    label: status.name,
  }))
}

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
