'use client'

import { motion } from 'framer-motion'
import { Avatar } from '@/components/atoms/Avatar'
import { CandidateDetailLink } from '@/components/molecules/CandidateDetailLink'
import { MissionMatchingScoredCardActions } from '@/components/molecules/MissionMatchingScoredCardActions'
import { MissionMatchingScoredCardBody } from '@/components/molecules/MissionMatchingScoredCardBody'
import { listItem } from '@/lib/motion/variants'
import { cn } from '@/lib/cn'
import { compatibilityScoreStyle } from '@/view-models/compatibility-score-style'
import type { MissionMatchingScoredRow } from '@/view-models/mission-matching'

type Props = {
  row: MissionMatchingScoredRow
  rank: number
  index: number
  missionId: string
  positioned: boolean
  pipelineLocked?: boolean
  onPositioned: (candidateId: string) => void
}

export function MissionMatchingScoredCard({
  row,
  rank,
  index,
  missionId,
  positioned,
  pipelineLocked,
  onPositioned,
}: Props) {
  return (
    <motion.li variants={listItem} custom={index} className="list-none">
      <article className="overflow-hidden rounded-2xl border border-border/55 bg-white/95 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-stretch">
          <div className="flex min-w-0 flex-1">
            <div className="grid w-10 shrink-0 place-items-center bg-gradient-to-b from-accent-muted/80 to-white text-sm font-bold text-accent">
              {rank}
            </div>
            <div className="min-w-0 flex-1 p-4">
              <div className="flex items-start gap-3">
                <Avatar name={row.fullName} className="size-10 text-xs" />
                <div className="min-w-0 flex-1">
                  <CandidateDetailLink
                    candidateId={row.candidateId}
                    className="truncate font-semibold text-fg underline-offset-2 hover:underline"
                  >
                    {row.fullName}
                  </CandidateDetailLink>
                  <p className="truncate text-xs text-fg-muted">
                    {row.jobTitle}
                    {row.city ? ` · ${row.city}` : ''}
                  </p>
                </div>
                <span
                  className={cn(
                    'shrink-0 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums sm:hidden',
                    compatibilityScoreStyle(row.score),
                  )}
                >
                  {row.score}%
                </span>
              </div>
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
            positioned={positioned}
            pipelineLocked={pipelineLocked}
            onPositioned={() => onPositioned(row.candidateId)}
          />
        </div>
      </article>
    </motion.li>
  )
}
