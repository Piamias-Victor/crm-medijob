'use client'

import { motion } from 'framer-motion'
import { Avatar } from '@/components/atoms/Avatar'
import { Badge } from '@/components/atoms/Badge'
import { CandidateDetailLink } from '@/components/molecules/CandidateDetailLink'
import { MATCHING_FIELD_LABELS } from '@/lib/candidate-options'
import { MATCHING_REASON_META } from '@/lib/matching-reason-meta'
import { listItem } from '@/lib/motion/variants'
import type { MissionMatchingExcludedRow } from '@/view-models/mission-matching'

type Props = { row: MissionMatchingExcludedRow; index: number }

export function MissionMatchingExcludedCard({ row, index }: Props) {
  return (
    <motion.li variants={listItem} custom={index} className="list-none">
      <article className="flex items-start gap-3 rounded-xl border border-border/45 bg-surface/40 px-3 py-3">
        <Avatar name={row.fullName} className="size-9 text-[11px]" />
        <div className="min-w-0 flex-1 space-y-2">
          <div>
            <CandidateDetailLink
              candidateId={row.candidateId}
              className="text-sm font-semibold text-fg underline-offset-2 hover:underline"
            >
              {row.fullName}
            </CandidateDetailLink>
            <p className="text-xs text-fg-muted">
              {row.jobTitle}
              {row.city ? ` · ${row.city}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {row.reasons.map((reason) => {
              const meta = MATCHING_REASON_META[reason.code]
              const Icon = meta.icon
              return (
                <Badge key={reason.code} variant={meta.badge} className="gap-1">
                  <Icon className="size-3" aria-hidden />
                  {reason.label}
                </Badge>
              )
            })}
          </div>
          {row.isProfileIncomplete ? (
            <div className="flex flex-wrap gap-1">
              {row.missingMatchingFields.map((field) => (
                <span key={field} className="text-[11px] text-warning">
                  {MATCHING_FIELD_LABELS[field] ?? field}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    </motion.li>
  )
}
