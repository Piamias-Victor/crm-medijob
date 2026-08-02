'use client'

import { MissionTable } from '@/components/organisms/mission-table/mission-table'
import { MissionKanban } from '@/components/organisms/MissionKanban'
import { MissionMapView } from '@/components/organisms/MissionMapView'
import type { EntityTableSortState } from '@/components/organisms/entity-table/entity-table-types'
import type { EntityViewPanel } from '@/components/molecules/EntityViewShell'
import type { MissionView } from '@/components/molecules/ViewToggle'
import type { MissionListRow } from '@/view-models/mission-list'
import type { RawMission } from '@/view-models/mission-kanban.types'

type Args = {
  listRows: MissionListRow[]
  rows: RawMission[]
  sort: EntityTableSortState | null
  onSortChange: (sort: EntityTableSortState | null) => void
}

export function buildMissionViewPanels({
  listRows,
  rows,
  sort,
  onSortChange,
}: Args): Record<MissionView, EntityViewPanel> {
  return {
    list: {
      title: 'Toutes les missions',
      description: 'Colonnes CSV avec vue rapide.',
      content: <MissionTable rows={listRows} sort={sort} onSortChange={onSortChange} />,
    },
    kanban: {
      title: 'Pipeline missions',
      description: 'Glissez une carte pour changer le statut.',
      content: <MissionKanban missions={rows} />,
    },
    map: {
      title: 'Carte missions',
      description: 'Points = coords pharmacie. Filtrez contrat / statut.',
      content: <MissionMapView missions={rows} />,
    },
  }
}
