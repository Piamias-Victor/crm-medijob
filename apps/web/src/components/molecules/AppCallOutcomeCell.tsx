'use client'

import { Select } from '@/components/atoms/Select'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import {
  APP_CALL_OUTCOMES,
  type AppCallOutcome,
} from '@/view-models/app-profile-intake.enums'
import { APP_CALL_OUTCOME_LABELS } from '@/view-models/app-profile-intake.labels'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'

type Props = { row: AppProfileListItem }

export function AppCallOutcomeCell({ row }: Props) {
  const { save, isPending } = useAppIntakeUpdate(row)
  return (
    <Select
      aria-label="Call outcome"
      className="min-w-[9rem] py-1 text-xs"
      value={row.callOutcome ?? ''}
      disabled={isPending}
      onChange={(e) => {
        const value = e.target.value
        save({ callOutcome: value === '' ? null : (value as AppCallOutcome) })
      }}
    >
      <option value="">{TABLE_EMPTY_CELL}</option>
      {APP_CALL_OUTCOMES.map((value) => (
        <option key={value} value={value}>
          {APP_CALL_OUTCOME_LABELS[value]}
        </option>
      ))}
    </Select>
  )
}
