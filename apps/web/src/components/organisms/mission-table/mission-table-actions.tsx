import Link from 'next/link'
import type { MissionListRow } from '@/view-models/mission-list'
import { missionDetailHref } from '@/lib/mission-href'

export function MissionTableActions({
  row,
  returnPath,
}: {
  row: MissionListRow
  returnPath: string
}) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <Link
        href={missionDetailHref(row.id, returnPath)}
        className="inline-flex h-7 items-center rounded-md bg-accent px-2 text-xs font-medium text-accent-fg shadow-sm shadow-accent/20 transition-colors hover:bg-accent-hover"
        onClick={(event) => event.stopPropagation()}
      >
        Modifier
      </Link>
    </div>
  )
}
