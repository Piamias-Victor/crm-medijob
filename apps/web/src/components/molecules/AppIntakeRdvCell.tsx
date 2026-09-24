'use client'

import { Input } from '@/components/atoms/Input'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import { toDateInputValue } from '@/view-models/date-input-value'

type Props = { row: AppProfileListItem }

export function AppIntakeRdvCell({ row }: Props) {
  const { save, isPending } = useAppIntakeUpdate(row)
  return (
    <Input
      type="date"
      aria-label="Date RDV"
      className="min-w-[9rem] py-1 text-xs"
      value={toDateInputValue(row.plannedRdvAt)}
      disabled={isPending}
      onChange={(e) => {
        const raw = e.target.value
        save({ plannedRdvAt: raw ? new Date(`${raw}T12:00:00.000Z`) : null })
      }}
    />
  )
}
