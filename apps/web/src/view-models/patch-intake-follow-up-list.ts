import { TABLE_EMPTY_CELL } from '@/lib/constants/table-empty-cell'
import type { AppProfileListItem } from '@/view-models/app-profile-list'

export function staysInDefaultIntakeView(row: AppProfileListItem): boolean {
  if (row.status === 'IGNORE') return false
  if (row.candidateId == null) return true
  return row.candidateStatus === 'NOUVEAU'
}

function keepDisplayLabel(next: string, previous: string): string {
  if (!next || next === TABLE_EMPTY_CELL) return previous
  return next
}

export function patchIntakeFollowUpList(
  rows: AppProfileListItem[] | undefined,
  next: AppProfileListItem,
  population: 'default' | 'archive',
): AppProfileListItem[] | undefined {
  if (!rows) return rows
  const keep =
    population === 'archive' ? !staysInDefaultIntakeView(next) : staysInDefaultIntakeView(next)
  const without = rows.filter((row) => row.id !== next.id)
  if (!keep) return without
  const merged = rows.map((row) =>
    row.id === next.id
      ? {
          ...next,
          badakanCommentsLabel: keepDisplayLabel(
            next.badakanCommentsLabel,
            row.badakanCommentsLabel,
          ),
          intakeBookingSmsLabel: keepDisplayLabel(
            next.intakeBookingSmsLabel,
            row.intakeBookingSmsLabel,
          ),
          referentName: next.referentName ?? row.referentName,
          lastCalledByName: next.lastCalledByName ?? row.lastCalledByName,
        }
      : row,
  )
  return rows.some((row) => row.id === next.id) ? merged : [...without, next]
}
