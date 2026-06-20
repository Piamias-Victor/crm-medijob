'use client'

import { Briefcase } from 'lucide-react'
import { MissionListCard } from '@/components/molecules/MissionListCard'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import type { MissionListRow } from '@/view-models/mission-list'

type Props = { rows: MissionListRow[] }

export function MissionList({ rows }: Props) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <MissionListCard row={row} />}
      emptyIcon={Briefcase}
      emptyTitle="Aucune mission"
      emptyDescription="Les besoins de staffing apparaîtront ici."
    />
  )
}
