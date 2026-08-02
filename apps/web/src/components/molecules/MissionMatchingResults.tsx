'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionMatchingContactPanel } from '@/components/molecules/MissionMatchingContactPanel'
import { MissionMatchingExcludedSection } from '@/components/molecules/MissionMatchingExcludedSection'
import { MissionMatchingScoredCard } from '@/components/molecules/MissionMatchingScoredCard'
import { MissionMatchingStats } from '@/components/molecules/MissionMatchingStats'
import { listContainer } from '@/lib/motion/variants'
import { matchingContactSubject } from '@/view-models/matching-contact-subject'
import { toggleSelectedId } from '@/view-models/toggle-selected-id'
import type {
  MissionMatchingExcludedRow,
  MissionMatchingScoredRow,
} from '@/view-models/mission-matching'

type Props = {
  missionId: string
  missionTitle: string
  pharmacyName: string
  positionedIds: string[]
  pipelineLocked?: boolean
  onPositioned: (candidateId: string) => void
  scored: MissionMatchingScoredRow[]
  excluded: MissionMatchingExcludedRow[]
}

export function MissionMatchingResults({
  missionId,
  missionTitle,
  pharmacyName,
  positionedIds,
  pipelineLocked,
  onPositioned,
  scored,
  excluded,
}: Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const selected = useMemo(
    () => scored.filter((row) => selectedIds.includes(row.candidateId)),
    [scored, selectedIds],
  )
  const subject = matchingContactSubject(missionTitle, pharmacyName)

  return (
    <div className="flex flex-col gap-6">
      <MissionMatchingStats scoredCount={scored.length} excludedCount={excluded.length} />
      <MissionMatchingContactPanel
        missionId={missionId}
        subject={subject}
        selected={selected}
        onClear={() => setSelectedIds([])}
      />

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-success" aria-hidden />
          <h3 className="text-sm font-semibold text-fg">Classement IA</h3>
        </div>
        {scored.length === 0 ? (
          <EmptyState
            variant="compact"
            icon={Sparkles}
            title="Aucun candidat éligible"
            description="Tous les profils ont été filtrés (métier, géo, distance, contrat ou dispo)."
          />
        ) : (
          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {scored.map((row, index) => (
              <MissionMatchingScoredCard
                key={row.candidateId}
                row={row}
                rank={index + 1}
                index={index}
                missionId={missionId}
                selected={selectedIds.includes(row.candidateId)}
                onToggleSelect={() =>
                  setSelectedIds((ids) => toggleSelectedId(ids, row.candidateId))
                }
                positioned={positionedIds.includes(row.candidateId)}
                pipelineLocked={pipelineLocked}
                onPositioned={onPositioned}
              />
            ))}
          </motion.ul>
        )}
      </section>

      <MissionMatchingExcludedSection excluded={excluded} />
    </div>
  )
}
