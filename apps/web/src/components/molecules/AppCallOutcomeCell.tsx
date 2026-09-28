'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import {
  CALL_OUTCOME_OPTIONS,
  INTAKE_CELL_COMBOBOX_CLASS,
} from '@/view-models/app-intake-combobox-options'
import type { AppCallOutcome } from '@/view-models/app-profile-intake.enums'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppCallOutcomeCell({ row }: Props) {
  const listKey = useAppIntakeListKey()
  const { save, isPending } = useAppIntakeUpdate(row, listKey)
  return (
    <Combobox
      aria-label="Call outcome"
      className={INTAKE_CELL_COMBOBOX_CLASS}
      value={row.callOutcome ?? ''}
      options={CALL_OUTCOME_OPTIONS}
      disabled={isPending}
      onChange={(value) =>
        save({ callOutcome: value === '' ? null : (value as AppCallOutcome) })
      }
    />
  )
}
