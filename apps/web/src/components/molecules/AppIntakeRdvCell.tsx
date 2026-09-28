'use client'

import { DatePicker } from '@/components/molecules/DatePicker'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import { CLEAR_DATE_LABEL } from '@/lib/date-picker-utils'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import { toDateInputValue } from '@/view-models/date-input-value'

type Props = { row: AppProfileListItem }

export function AppIntakeRdvCell({ row }: Props) {
  const listKey = useAppIntakeListKey()
  const { save, isPending } = useAppIntakeUpdate(row, listKey)
  const value = toDateInputValue(row.plannedRdvAt)
  return (
    <div className="min-w-[9.5rem] max-w-[11rem]">
      <DatePicker
        ariaLabel="Date RDV"
        emptyLabel="RDV"
        clearLabel={CLEAR_DATE_LABEL}
        value={value || undefined}
        disabled={isPending}
        className="px-2 py-1 text-xs"
        onChange={(iso) =>
          save({ plannedRdvAt: iso ? new Date(`${iso}T12:00:00.000Z`) : null })
        }
      />
    </div>
  )
}
