'use client'

import { useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Briefcase } from 'lucide-react'
import {
  MissionTableActions,
  missionTableColumns,
} from '@/components/organisms/mission-table/mission-table-columns'
import { EntityTable } from '@/components/organisms/entity-table/entity-table'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import { MissionQuickView } from '@/components/organisms/MissionQuickView'
import { buildMissionReturnPath } from '@/lib/mission-href'
import type { MissionListRow } from '@/view-models/mission-list'

type Props = {
  rows: MissionListRow[]
  sort: EntityTableSortState | null
  onSortChange: (sort: EntityTableSortState | null) => void
}

export function MissionTable({ rows, sort, onSortChange }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [quickViewId, setQuickViewId] = useState<string | null>(null)
  const returnPath = useMemo(
    () => buildMissionReturnPath(pathname, searchParams.toString()),
    [pathname, searchParams],
  )

  return (
    <>
      <EntityTable
        rows={rows}
        columns={missionTableColumns}
        getRowId={(row) => row.id}
        onRowClick={(row) => setQuickViewId(row.id)}
        emptyIcon={Briefcase}
        emptyTitle="Aucune mission"
        emptyDescription="Ajustez les filtres pour afficher des résultats."
        renderActions={(row) => (
          <MissionTableActions
            row={row}
            returnPath={returnPath}
            onQuickView={setQuickViewId}
          />
        )}
        sort={sort}
        onSortChange={onSortChange}
      />
      <MissionQuickView
        missionId={quickViewId}
        returnPath={returnPath}
        onClose={() => setQuickViewId(null)}
      />
    </>
  )
}
