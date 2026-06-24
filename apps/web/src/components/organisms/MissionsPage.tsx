'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toMissionListRows } from '@/view-models/mission-list'
import { Briefcase, Plus } from 'lucide-react'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
import { Button } from '@/components/atoms/Button'
import { DashboardPage } from '@/components/molecules/DashboardPage'
import { ListKanbanShell } from '@/components/molecules/ListKanbanShell'
import { MissionFormModal } from '@/components/molecules/MissionFormModal'
import { MissionList } from '@/components/organisms/MissionList'
import { MissionKanban } from '@/components/organisms/MissionKanban'
import type { ListKanbanView } from '@/components/molecules/ViewToggle'
import { missionViewOptions } from '@/components/molecules/ViewToggle'
import type { RawMission } from '@/view-models/mission-kanban.types'

type Ref = { id: string; name: string }

type Props = {
  rows: RawMission[]
  pharmacies: Ref[]
  jobTitles: Ref[]
  recruiters: Ref[]
}

export function MissionsPage({ rows, pharmacies, jobTitles, recruiters }: Props) {
  const router = useRouter()
  const [view, setView] = useState<ListKanbanView>('list')
  const [open, setOpen] = useState(false)
  const listRows = useMemo(() => toMissionListRows(rows), [rows])
  const description = useMemo(
    () => `${listRows.length} mission(s) — liste complète ou kanban par statut.`,
    [listRows.length],
  )
  const refresh = () => {
    setOpen(false)
    router.refresh()
  }
  const createMutation = useEntityMutation({ onSuccess: refresh, successMessage: 'Mission créée' })
  const refMutation = useEntityMutation()
  const create = trpc.mission.create.useMutation(createMutation)
  const newJobTitle = trpc.mission.createJobTitle.useMutation(refMutation)

  return (
    <DashboardPage
      icon={<Briefcase className="size-5" />}
      title="Missions"
      description={description}
      actions={
        <Button variant="accent" className="shadow-md shadow-accent/20" onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          Nouvelle mission
        </Button>
      }
    >
      <ListKanbanShell
        view={view}
        primaryView="list"
        onViewChange={setView}
        viewOptions={missionViewOptions}
        listTitle="Toutes les missions"
        kanbanTitle="Pipeline missions"
        listDescription="Toutes les missions, y compris pourvues et annulées."
        kanbanDescription="Glissez une carte pour changer le statut."
        listView={<MissionList rows={listRows} />}
        kanbanView={<MissionKanban missions={rows} />}
      />
      <MissionFormModal
        open={open}
        pharmacies={pharmacies}
        jobTitles={jobTitles}
        recruiters={recruiters}
        submitting={create.isPending}
        onClose={() => setOpen(false)}
        onSubmit={(data) => create.mutate(data)}
        onCreateJobTitle={(name) => newJobTitle.mutateAsync({ name })}
      />
    </DashboardPage>
  )
}
