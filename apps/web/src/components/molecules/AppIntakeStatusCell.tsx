'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import {
  INTAKE_CELL_COMBOBOX_CLASS,
  INTAKE_STATUS_OPTIONS,
} from '@/view-models/app-intake-combobox-options'
import type { AppIntakeStatus } from '@/view-models/app-profile-intake.enums'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeStatusCell({ row }: Props) {
  const listKey = useAppIntakeListKey()
  const { save, isPending } = useAppIntakeUpdate(row, listKey)
  return (
    <Combobox
      aria-label="Intake status"
      className={INTAKE_CELL_COMBOBOX_CLASS}
      value={row.intakeStatus}
      options={INTAKE_STATUS_OPTIONS}
      disabled={isPending}
      onChange={(value) => save({ intakeStatus: value as AppIntakeStatus })}
    />
  )
}
