'use client'

import { useMemo, useState } from 'react'
import { toMissionListRows } from '@/view-models/mission-list'
import { Briefcase } from 'lucide-react'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { ListKanbanShell } from '@/components/molecules/ListKanbanShell'
import { MissionList } from '@/components/organisms/MissionList'
import { MissionKanban } from '@/components/organisms/MissionKanban'
import type { CvView } from '@/components/molecules/ViewToggle'
import type { RawMission } from '@/view-models/mission-kanban.types'

type Props = { rows: RawMission[] }

export function MissionsPage({ rows }: Props) {
  const [view, setView] = useState<CvView>('list')
  const listRows = useMemo(() => toMissionListRows(rows), [rows])
  const description = useMemo(
    () => `${listRows.length} mission(s) — liste complète ou kanban par statut.`,
    [listRows.length],
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
        listView={<MissionList rows={listRows} />}
        kanbanView={<MissionKanban missions={rows} />}
      />
    </DashboardPage>
  )
}
