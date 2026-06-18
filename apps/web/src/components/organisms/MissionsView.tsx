'use client'

import { useState } from 'react'
import { ViewToggle, type CvView } from '@/components/molecules/ViewToggle'
import { AdminSectionCard } from '@/components/molecules/AdminSectionCard'
import { MissionList } from '@/components/organisms/MissionList'
import { MissionKanban } from '@/components/organisms/MissionKanban'
import type { RawMission } from '@/view-models/mission-kanban'

type Props = { missions: RawMission[] }

export function MissionsView({ missions }: Props) {
  const [view, setView] = useState<CvView>('list')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <ViewToggle view={view} onChange={setView} />
      </div>
      {view === 'list' ? (
        <AdminSectionCard
          title="Toutes les missions"
          description={`${missions.length} mission(s) — y compris pourvues et annulées.`}
        >
          <MissionList missions={missions} embedded />
        </AdminSectionCard>
      ) : (
        <MissionKanban missions={missions} />
      )}
    </div>
  )
}
