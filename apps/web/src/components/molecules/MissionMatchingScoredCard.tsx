'use client'

import { motion } from 'framer-motion'
import { MissionMatchingContactLine } from '@/components/molecules/MissionMatchingContactLine'
import { MissionMatchingScoredCardActions } from '@/components/molecules/MissionMatchingScoredCardActions'
import { MissionMatchingScoredCardBody } from '@/components/molecules/MissionMatchingScoredCardBody'
import { MissionMatchingScoredCardHeader } from '@/components/molecules/MissionMatchingScoredCardHeader'
import { listItem } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'
import type { MissionMatchingScoredRow } from '@/view-models/mission-matching'

type Props = {
  row: MissionMatchingScoredRow
  rank: number
  index: number
  missionId: string
  selected: boolean
  onToggleSelect: () => void
  positioned: boolean
  proposed?: boolean
  pipelineLocked?: boolean
  onPositioned: (candidateId: string) => void
  onProposed?: (candidateId: string) => void
}

export function MissionMatchingScoredCard({
  row,
  rank,
  index,
  missionId,
  selected,
  onToggleSelect,
  positioned,
  proposed,
  pipelineLocked,
  onPositioned,
  onProposed,
}: Props) {
  return (
    <motion.li variants={listItem} custom={index} className="list-none">
      <article
        className={cn(
          'overflow-hidden rounded-2xl border bg-white/95 shadow-sm',
          selected ? 'border-accent/60 ring-1 ring-accent/25' : 'border-border/55',
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <div className="flex min-w-0 flex-1">
            <label className="grid w-10 shrink-0 cursor-pointer place-items-center bg-gradient-to-b from-accent-muted/80 to-white">
              <span className="sr-only">Sélectionner {row.fullName}</span>
              <input
                type="checkbox"
                checked={selected}
                onChange={onToggleSelect}
                className="size-4 rounded border-border accent-[var(--color-accent)]"
              />
              <span className="mt-1 text-xs font-bold text-accent">{rank}</span>
            </label>
            <div className="min-w-0 flex-1 p-4">
              <MissionMatchingScoredCardHeader
                candidateId={row.candidateId}
                fullName={row.fullName}
                jobTitle={row.jobTitle}
                city={row.city}
                salaryLabel={row.salaryLabel}
                score={row.score}
              />
              <MissionMatchingContactLine email={row.email} phone={row.phone} />
              <MissionMatchingScoredCardBody
                score={row.score}
                justification={row.justification}
                missingFields={row.isProfileIncomplete ? row.missingMatchingFields : []}
              />
            </div>
          </div>
          <MissionMatchingScoredCardActions
            missionId={missionId}
            candidateId={row.candidateId}
            score={row.score}
            justification={row.justification}
            positioned={positioned}
            proposed={proposed}
            pipelineLocked={pipelineLocked}
            onPositioned={() => onPositioned(row.candidateId)}
            onProposed={() => onProposed?.(row.candidateId)}
          />
        </div>
      </article>
    </motion.li>
  )
}
