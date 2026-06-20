'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MissionStatus } from '@/view-models/mission-kanban.types'
import { LayoutGrid } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionKanbanColumnView } from '@/components/molecules/MissionKanbanColumn'
import { countActiveMissions } from '@/lib/kanban-terminal'
import { trpc } from '@/lib/trpc/client'
import { useKanbanOptimisticMutation } from '@/lib/hooks/use-kanban-optimistic-mutation'
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
  const mutation = trpc.mission.updateStatus.useMutation({ onSettled: () => router.refresh() })
  const move = useKanbanOptimisticMutation({
    rows,
    setRows,
    applyOptimistic: (prev, vars: { id: string; status: MissionStatus }) =>
      moveMissionStatus(prev, vars.id, vars.status),
    mutate: mutation.mutate,
  })

  if (activeCount === 0) {
    return (
      <EmptyState
        icon={LayoutGrid}
        title="Aucune mission active"
        description="Les missions pourvues ou annulées n’apparaissent plus dans le kanban."
      />
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-fg-muted">{activeCount} mission(s) active(s) dans le pipeline.</p>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {columns.map((column) => (
          <MissionKanbanColumnView
            key={column.status}
            column={column}
            onDrop={(missionId, status) => move({ id: missionId, status })}
          />
        ))}
      </div>
    </div>
  )
}
