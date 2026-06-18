'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MissionStatus } from '@prisma/client'
import { LayoutGrid } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { AdminSectionCard } from '@/components/molecules/AdminSectionCard'
import { MissionKanbanColumnView } from '@/components/molecules/MissionKanbanColumn'
import { countActiveMissions } from '@/lib/kanban-terminal'
import { trpc } from '@/lib/trpc/client'
import {
  buildMissionKanbanColumns,
  moveMissionStatus,
  type RawMission,
} from '@/view-models/mission-kanban'

type Props = { missions: RawMission[] }

export function MissionKanban({ missions }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState(missions)
  const columns = useMemo(() => buildMissionKanbanColumns(rows), [rows])
  const mutation = trpc.mission.updateStatus.useMutation({
    onSettled: () => router.refresh(),
  })

  function move(missionId: string, status: MissionStatus) {
    const snapshot = rows
    setRows((prev) => moveMissionStatus(prev, missionId, status))
    mutation.mutate({ id: missionId, status }, { onError: () => setRows(snapshot) })
  }

  if (missions.length === 0) {
    return <EmptyState icon={LayoutGrid} title="Aucune mission active" />
  }

  return (
    <AdminSectionCard
      title="Pipeline missions"
      description={`${countActiveMissions(rows)} mission(s) active(s) — glissez une carte pour changer le statut.`}
      className="bg-transparent shadow-none"
    >
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2">
        {columns.map((column) => (
          <MissionKanbanColumnView key={column.status} column={column} onDrop={move} />
        ))}
      </div>
    </AdminSectionCard>
  )
}
