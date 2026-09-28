'use client'

import { Combobox } from '@/components/molecules/Combobox'
import { useAppIntakeUpdate } from '@/lib/hooks/use-app-intake-update'
import { useAppIntakeListKey } from '@/lib/hooks/use-app-intake-list-key'
import {
  INTAKE_CELL_COMBOBOX_CLASS,
  referentComboboxOptions,
} from '@/view-models/app-intake-combobox-options'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

type Ref = { id: string; name: string }
type Props = { row: AppProfileListItem; recruiters: readonly Ref[] }

export function AppReferentCell({ row, recruiters }: Props) {
  const listKey = useAppIntakeListKey()
  const { save, isPending } = useAppIntakeUpdate(row, listKey)
  return (
    <Combobox
      aria-label="Referent"
      className={INTAKE_CELL_COMBOBOX_CLASS}
      value={row.referentId ?? ''}
      options={referentComboboxOptions(recruiters)}
      disabled={isPending}
      onChange={(value) => save({ referentId: value || null })}
    />
  )
}
