'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Avatar } from '@/components/atoms/Avatar'
import { KanbanMissionRow } from '@/components/molecules/KanbanMissionRow'
import { cardHover } from '@/lib/motion/variants'
import type { CandidateCard } from '@/view-models/candidate-kanban'

export function CandidateKanbanCard({ card }: { card: CandidateCard }) {
  const subtitle = [card.jobTitle, card.city].filter(Boolean).join(' · ')

  return (
    <motion.article
      {...cardHover}
      className="rounded-xl border border-border/55 bg-white/92 p-3 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10"
    >
      <Link
        href={`/candidats/${card.candidateId}`}
        className="mb-2 flex items-center gap-2 rounded-lg p-1 -m-1"
      >
        <Avatar name={card.name} className="size-7 text-xs" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">{card.name}</p>
          {subtitle ? <p className="truncate text-xs text-fg-muted">{subtitle}</p> : null}
        </div>
      </Link>
      <div className="space-y-1.5">
        {card.rows.map((row) => (
          <KanbanMissionRow key={row.missionId} row={row} />
        ))}
      </div>
    </motion.article>
  )
}
