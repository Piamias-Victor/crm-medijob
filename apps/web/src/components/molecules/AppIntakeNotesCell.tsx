'use client'

import { Input } from '@/components/atoms/Input'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Props = { row: AppProfileListItem }

export function AppIntakeNotesCell({ row }: Props) {
  const listKey = useAppIntakeListKey()
  const { save, isPending } = useAppIntakeUpdate(row, listKey)
  return (
    <Input
      aria-label="Notes"
      className="min-w-[9rem] max-w-[12rem] py-1 text-xs"
      key={row.notes ?? ''}
      defaultValue={row.notes ?? ''}
      disabled={isPending}
      onBlur={(e) => {
        const next = e.target.value.trim()
        const current = row.notes ?? ''
        if (next !== current) save({ notes: next === '' ? null : next })
      }}
    />
  )
}
