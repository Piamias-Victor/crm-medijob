'use client'

import { Select } from '@/components/atoms/Select'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import {
  APP_INTAKE_STATUSES,
  type AppIntakeStatus,
} from '@/view-models/app-profile-intake.enums'
import { APP_INTAKE_STATUS_LABELS } from '@/view-models/app-profile-intake.labels'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeStatusCell({ row }: Props) {
  const { save, isPending } = useAppIntakeUpdate(row)
  return (
    <Select
      aria-label="Intake status"
      className="min-w-[9rem] py-1 text-xs"
      value={row.intakeStatus}
      disabled={isPending}
      onChange={(e) => save({ intakeStatus: e.target.value as AppIntakeStatus })}
    >
      {APP_INTAKE_STATUSES.map((value) => (
        <option key={value} value={value}>
          {APP_INTAKE_STATUS_LABELS[value]}
        </option>
      ))}
    </Select>
  )
}
