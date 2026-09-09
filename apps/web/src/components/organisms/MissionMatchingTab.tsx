'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MissionStatus } from '@prisma/client'
import { trpc } from '@/lib/trpc/client'
import { isTerminalMissionStatus } from '@/lib/kanban-terminal'
import { MissionMatchingLaunchPanel } from '@/components/molecules/MissionMatchingLaunchPanel'
import { MissionMatchingTabBody } from '@/components/molecules/MissionMatchingTabBody'
import type { MissionMatchingPayload } from '@/view-models/mission-matching'

type Props = {
  missionId: string
  missionStatus: MissionStatus
  missionTitle: string
  jobTitleName: string
  pharmacyName: string
  positionedIds: string[]
}

export function MissionMatchingTab({
  missionId,
  missionStatus,
  missionTitle,
  jobTitleName,
  pharmacyName,
  positionedIds,
}: Props) {
  const router = useRouter()
  const [result, setResult] = useState<MissionMatchingPayload | null>(null)
  const [recentlyPositioned, setRecentlyPositioned] = useState<string[]>([])
  const matching = trpc.matching.scoreMissionCandidates.useMutation({ onSuccess: setResult })
  const knownPositioned = useMemo(
    () => [...new Set([...positionedIds, ...recentlyPositioned])],
    [positionedIds, recentlyPositioned],
  )

  const handlePositioned = (candidateId: string) => {
    setRecentlyPositioned((prev) => (prev.includes(candidateId) ? prev : [...prev, candidateId]))
    router.refresh()
  }

  return (
    <div className="flex flex-col gap-6">
      <MissionMatchingLaunchPanel
        jobTitleName={jobTitleName}
        pharmacyName={pharmacyName}
        pending={matching.isPending}
        onLaunch={() => matching.mutate({ missionId })}
      />
      <MissionMatchingTabBody
        pending={matching.isPending}
        errorMessage={matching.error?.message}
        result={result}
        missionId={missionId}
        missionTitle={missionTitle}
        pharmacyName={pharmacyName}
        positionedIds={knownPositioned}
        pipelineLocked={isTerminalMissionStatus(missionStatus)}
        onPositioned={handlePositioned}
      />
    </div>
  )
}
