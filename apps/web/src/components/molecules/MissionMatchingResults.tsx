'use client'

import { useMemo, useState } from 'react'
import { MissionMatchingContactPanel } from '@/components/molecules/MissionMatchingContactPanel'
import { MissionMatchingExcludedSection } from '@/components/molecules/MissionMatchingExcludedSection'
import { MissionMatchingScoredList } from '@/components/molecules/MissionMatchingScoredList'
import { MissionMatchingStats } from '@/components/molecules/MissionMatchingStats'
import { matchingContactSubject } from '@/view-models/matching-contact-subject'
import type {
  MissionMatchingExcludedRow,
  MissionMatchingScoredRow,
} from '@/view-models/mission-matching'

type Props = {
  missionId: string
  missionTitle: string
  pharmacyName: string
  positionedIds: string[]
  proposedIds?: string[]
  pipelineLocked?: boolean
  onPositioned: (candidateId: string) => void
  onProposed?: (candidateId: string) => void
  scored: MissionMatchingScoredRow[]
  excluded: MissionMatchingExcludedRow[]
  eligibleCount: number
  excludedCount: number
}

export function MissionMatchingResults({
  missionId,
  missionTitle,
  pharmacyName,
  positionedIds,
  proposedIds,
  pipelineLocked,
  onPositioned,
  onProposed,
  scored,
  excluded,
  eligibleCount,
  excludedCount,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const selected = useMemo(
    () => scored.filter((row) => selectedIds.includes(row.candidateId)),
    [scored, selectedIds],
  )

  return (
    <div className="flex flex-col gap-6">
      <MissionMatchingStats
        scoredCount={scored.length}
        eligibleCount={eligibleCount}
        excludedCount={excludedCount}
      />
      <MissionMatchingContactPanel
        missionId={missionId}
        subject={matchingContactSubject(missionTitle, pharmacyName)}
        selected={selected}
        onClear={() => setSelectedIds([])}
      />
      <MissionMatchingScoredList
        missionId={missionId}
        scored={scored}
        selectedIds={selectedIds}
        setSelectedIds={setSelectedIds}
        positionedIds={positionedIds}
        proposedIds={proposedIds}
        pipelineLocked={pipelineLocked}
        onPositioned={onPositioned}
        onProposed={onProposed}
      />
      <MissionMatchingExcludedSection excluded={excluded} />
    </div>
  )
}
