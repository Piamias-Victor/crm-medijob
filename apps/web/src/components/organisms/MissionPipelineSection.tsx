'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MissionStatus } from '@prisma/client'
import { isTerminalMissionStatus } from '@/lib/kanban-terminal'
import type { MissionDetailPayload } from '@/view-models/mission-detail.types'
import type { PipelineStageRef } from '@/view-models/mission-pipeline.types'
import { MissionCandidatePicker } from '@/components/molecules/MissionCandidatePicker'
import { MissionPipelineKanban } from '@/components/organisms/MissionPipelineKanban'
import { toPipelineRows } from '@/view-models/mission-pipeline-map'

type Props = {
  mission: MissionDetailPayload
  stages: PipelineStageRef[]
}

export function MissionPipelineSection({ mission, stages }: Props) {
  const router = useRouter()
  const [rows, setRows] = useState(() => toPipelineRows(mission.candidates))
  const [status, setStatus] = useState<MissionStatus>(mission.status)
  const positionedIds = useMemo(() => rows.map((row) => row.candidateId), [rows])
  const locked = isTerminalMissionStatus(status)

  useEffect(() => {
    setRows(toPipelineRows(mission.candidates))
    setStatus(mission.status)
  }, [mission.candidates, mission.status])

  return (
    <div className="flex flex-col gap-5">
      {!locked ? (
        <MissionCandidatePicker
          missionId={mission.id}
          positionedIds={positionedIds}
          onPositioned={() => router.refresh()}
        />
      ) : null}
      <MissionPipelineKanban
        missionId={mission.id}
        status={status}
        rows={rows}
        onRowsChange={setRows}
        onStatusChange={setStatus}
        stages={stages}
      />
    </div>
  )
}
