'use client'

import { Input } from '@/components/atoms/Input'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import { toDateInputValue } from '@/view-models/date-input-value'

type Props = { row: AppProfileListItem }

export function AppRelanceCell({ row }: Props) {
  const { save, isPending } = useAppIntakeUpdate(row)
  return (
    <div className="flex flex-col gap-0.5">
      <Input
        type="date"
        aria-label="Relance"
        className="min-w-[9rem] py-1 text-xs"
        value={toDateInputValue(row.relanceAt)}
        disabled={isPending}
        onChange={(e) => {
          const raw = e.target.value
          save({ relanceAt: raw ? new Date(`${raw}T12:00:00.000Z`) : null })
        }}
      />
      {row.isRelanceOverdue ? (
        <span className="text-[10px] font-medium text-[var(--color-error)]">En retard</span>
      ) : null}
    </div>
  )
}
