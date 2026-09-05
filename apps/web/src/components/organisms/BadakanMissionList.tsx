'use client'

import { CalendarClock } from 'lucide-react'
import { InterimTable } from '@/components/organisms/interim-table/interim-table'
import { missionColumns } from '@/components/organisms/interim-table/interim-table-columns'
import { matchesMission, missionFilterConfig } from '@/lib/filters/badakan-interim-filters'
import type { BadakanMissionListItem } from '@/view-models/badakan-mission-list'

export function BadakanMissionList({ rows }: { rows: BadakanMissionListItem[] }) {
  return (
    <InterimTable
      rows={rows}
      columns={missionColumns}
      filterConfig={missionFilterConfig}
      matches={matchesMission}
      getRowHref={(row) => row.href}
      emptyIcon={CalendarClock}
      emptyTitle="Aucune mission Badakan"
      emptyDescription="Ajustez les filtres pour afficher des résultats."
    />
  )
}
