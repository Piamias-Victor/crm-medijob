'use client'

import { CalendarClock } from 'lucide-react'
import { BadakanMissionListCard } from '@/components/molecules/BadakanMissionListCard'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import type { BadakanMissionListItem } from '@/view-models/badakan-mission-list'

export function BadakanMissionList({ rows }: { rows: BadakanMissionListItem[] }) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <BadakanMissionListCard row={row} />}
      emptyIcon={CalendarClock}
      emptyTitle="Aucune mission Badakan"
      emptyDescription="Les shifts Badakan synchronisés apparaîtront ici."
    />
  )
}
