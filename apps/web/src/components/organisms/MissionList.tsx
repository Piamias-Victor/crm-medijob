'use client'

import { Briefcase } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { AnimatedEntityGrid } from '@/components/molecules/AnimatedEntityGrid'
import { MissionListCard } from '@/components/molecules/MissionListCard'
import { toMissionListItems, type RawMission } from '@/view-models/mission-kanban'

type Props = { missions: RawMission[] }

export function MissionList({ missions }: Props) {
  const rows = toMissionListItems(missions)

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={Briefcase}
        title="Aucune mission"
        description="Les besoins de staffing apparaîtront ici."
      />
    )
  }

  return (
    <AnimatedEntityGrid
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <MissionListCard row={row} />}
    />
  )
}
