'use client'

import { motion } from 'framer-motion'
import { Sparkles, UserX } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionMatchingExcludedCard } from '@/components/molecules/MissionMatchingExcludedCard'
import { MissionMatchingScoredCard } from '@/components/molecules/MissionMatchingScoredCard'
import { MissionMatchingStats } from '@/components/molecules/MissionMatchingStats'
import { listContainer } from '@/lib/motion/variants'
import type {
  MissionMatchingExcludedRow,
  MissionMatchingScoredRow,
} from '@/view-models/mission-matching'

type Props = {
  missionId: string
  positionedIds: string[]
  pipelineLocked?: boolean
  onPositioned: (candidateId: string) => void
  scored: MissionMatchingScoredRow[]
  excluded: MissionMatchingExcludedRow[]
}

export function MissionMatchingResults({
  missionId,
  positionedIds,
  pipelineLocked,
  onPositioned,
  scored,
  excluded,
}: Props) {
  return (
    <div className="flex flex-col gap-6">
      <MissionMatchingStats scoredCount={scored.length} excludedCount={excluded.length} />

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
                positioned={positionedIds.includes(row.candidateId)}
                pipelineLocked={pipelineLocked}
                onPositioned={onPositioned}
              />
            ))}
          </motion.ul>
        )}
      </section>

      {excluded.length > 0 ? (
        <section className="space-y-3 rounded-2xl border border-border/40 bg-muted/15 p-4">
          <div className="flex items-center gap-2">
            <UserX className="size-4 text-fg-muted" aria-hidden />
            <h3 className="text-sm font-semibold text-fg">Exclus ({excluded.length})</h3>
          </div>
          <motion.ul
            variants={listContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-2"
          >
            {excluded.map((row, index) => (
              <MissionMatchingExcludedCard key={row.candidateId} row={row} index={index} />
            ))}
          </motion.ul>
        </section>
      ) : null}
    </div>
  )
}
