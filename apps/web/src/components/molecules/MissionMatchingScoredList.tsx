'use client'

import { type Dispatch, type SetStateAction } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { MissionMatchingScoredCard } from '@/components/molecules/MissionMatchingScoredCard'
import { listContainer } from '@/lib/motion/variants'
import { toggleSelectedId } from '@/view-models/toggle-selected-id'
import type { MissionMatchingScoredRow } from '@/view-models/mission-matching'

type Props = {
  missionId: string
  scored: MissionMatchingScoredRow[]
  selectedIds: string[]
  setSelectedIds: Dispatch<SetStateAction<string[]>>
  positionedIds: string[]
  proposedIds?: string[]
  pipelineLocked?: boolean
  onPositioned: (candidateId: string) => void
  onProposed?: (candidateId: string) => void
}

export function MissionMatchingScoredList({
  missionId,
  scored,
  selectedIds,
  setSelectedIds,
  positionedIds,
  proposedIds = [],
  pipelineLocked,
  onPositioned,
  onProposed,
}: Props) {
  return (
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
              onToggleSelect={() => setSelectedIds((ids) => toggleSelectedId(ids, row.candidateId))}
              positioned={positionedIds.includes(row.candidateId)}
              proposed={proposedIds.includes(row.candidateId)}
              pipelineLocked={pipelineLocked}
              onPositioned={onPositioned}
              onProposed={onProposed}
            />
          ))}
        </motion.ul>
      )}
    </section>
  )
}
