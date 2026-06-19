'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MissionStatus } from '@prisma/client'
import { LayoutGrid } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionKanbanColumnView } from '@/components/molecules/MissionKanbanColumn'
import { countActiveMissions } from '@/lib/kanban-terminal'
import { trpc } from '@/lib/trpc/client'
import { useEntityMutation } from '@/lib/hooks/use-entity-mutation'
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
  const activeCount = countActiveMissions(rows)
  const toast = useEntityMutation()
  const mutation = trpc.mission.updateStatus.useMutation({ onSettled: () => router.refresh() })

  function move(missionId: string, status: MissionStatus) {
    const snapshot = rows
    setRows((prev) => moveMissionStatus(prev, missionId, status))
    mutation.mutate(
      { id: missionId, status },
      {
        onError: (error) => {
          toast.onError(error)
          setRows(snapshot)
        },
      },
    )
  }

  if (missions.length === 0) {
    return <EmptyState icon={LayoutGrid} title="Aucune mission active" />
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-fg-muted">{activeCount} mission(s) active(s) dans le pipeline.</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((column) => (
          <MissionKanbanColumnView key={column.status} column={column} onDrop={move} />
        ))}
      </div>
    </div>
  )
}
