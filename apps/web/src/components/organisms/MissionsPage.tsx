'use client'

import { useMemo, useState } from 'react'
import { Briefcase } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { ListKanbanShell } from '@/components/molecules/ListKanbanShell'
import { MissionList } from '@/components/organisms/MissionList'
import { MissionKanban } from '@/components/organisms/MissionKanban'
import type { CvView } from '@/components/molecules/ViewToggle'
import type { MissionListRow } from '@/view-models/mission-list'
import type { RawMission } from '@/view-models/mission-kanban.types'

type Props = { rows: MissionListRow[]; kanban: RawMission[] }

export function MissionsPage({ rows, kanban }: Props) {
  const [view, setView] = useState<CvView>('list')
  const description = useMemo(
    () => `${rows.length} mission(s) — liste complète ou kanban par statut.`,
    [rows.length],
  )

  return (
    <DashboardPage icon={<Briefcase className="size-5" />} title="Missions" description={description}>
      <ListKanbanShell
        view={view}
        onViewChange={setView}
        listTitle="Toutes les missions"
        kanbanTitle="Pipeline missions"
        listDescription="Toutes les missions, y compris pourvues et annulées."
        kanbanDescription="Glissez une carte pour changer le statut."
        listView={<MissionList rows={rows} />}
        kanbanView={<MissionKanban missions={kanban} />}
      />
    </DashboardPage>
  )
}
