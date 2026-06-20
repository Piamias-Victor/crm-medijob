'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
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
  const positionedIds = useMemo(() => rows.map((row) => row.candidateId), [rows])
  const locked = isTerminalMissionStatus(mission.status)

  useEffect(() => {
    setRows(toPipelineRows(mission.candidates))
  }, [mission.candidates])

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
        status={mission.status}
        rows={rows}
        onRowsChange={setRows}
        stages={stages}
      />
    </div>
  )
}
