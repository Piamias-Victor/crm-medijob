'use client'

import { Select } from '@/components/atoms/Select'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import { buildReferentSelectOptions } from '@/view-models/referent-select-options'

type Ref = { id: string; name: string }
type Props = { row: AppProfileListItem; recruiters: readonly Ref[] }

export function AppReferentCell({ row, recruiters }: Props) {
  const { save, isPending } = useAppIntakeUpdate(row)
  return (
    <Select
      aria-label="Referent"
      className="min-w-[9rem] py-1 text-xs"
      value={row.referentId ?? ''}
      disabled={isPending}
      onChange={(e) => save({ referentId: e.target.value || null })}
    >
      {buildReferentSelectOptions(recruiters).map((opt) => (
        <option key={opt.value || 'none'} value={opt.value}>
          {opt.value ? opt.label : TABLE_EMPTY_CELL}
        </option>
      ))}
    </Select>
  )
}
