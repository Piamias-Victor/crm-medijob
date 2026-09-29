'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import { useAppIntakeStatuses } from '@/lib/hooks/use-app-intake-statuses'
import {
  INTAKE_CELL_COMBOBOX_CLASS,
  buildIntakeStatusOptions,
} from '@/view-models/app-intake-combobox-options'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeStatusCell({ row }: Props) {
  const listKey = useAppIntakeListKey()
  const statuses = useAppIntakeStatuses()
  const { save, isPending } = useAppIntakeUpdate(row, listKey)
  return (
    <Combobox
      aria-label="Intake status"
      className={INTAKE_CELL_COMBOBOX_CLASS}
      value={row.intakeStatus}
      options={buildIntakeStatusOptions(statuses)}
      disabled={isPending}
      onChange={(value) => save({ intakeStatus: value })}
    />
  )
}
