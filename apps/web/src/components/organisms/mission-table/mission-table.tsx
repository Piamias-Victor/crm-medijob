'use client'

import { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Briefcase } from 'lucide-react'
import {
  MissionTableActions,
  missionTableColumns,
} from '@/components/organisms/mission-table/mission-table-columns'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { buildMissionReturnPath, missionDetailHref } from '@/lib/mission-href'
import type { MissionListRow } from '@/view-models/mission-list'

type Props = {
  rows: MissionListRow[]
  sort: EntityTableSortState | null
  onSortChange: (sort: EntityTableSortState | null) => void
}

export function MissionTable({ rows, sort, onSortChange }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const returnPath = useMemo(
    () => buildMissionReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )

  return (
    <EntityTable
      rows={rows}
      columns={missionTableColumns}
      getRowId={(row) => row.id}
      getRowHref={(row) => missionDetailHref(row.id, returnPath)}
      emptyIcon={Briefcase}
      emptyTitle="Aucune mission"
      emptyDescription="Ajustez les filtres pour afficher des résultats."
      renderActions={(row) => <MissionTableActions row={row} returnPath={returnPath} />}
      sort={sort}
      onSortChange={onSortChange}
    />
  )
}
