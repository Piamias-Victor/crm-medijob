'use client'

import Link from 'next/link'
import { Avatar } from '@/components/atoms/Avatar'
import { KanbanMissionRow } from '@/components/molecules/KanbanMissionRow'
import type { CandidateCard } from '@/view-models/candidate-kanban'

export function CandidateKanbanCard({ card }: { card: CandidateCard }) {
  const subtitle = [card.jobTitle, card.city].filter(Boolean).join(' · ')

  return (
    <div className="rounded-lg border border-border bg-white p-3 shadow-sm transition-all hover:border-accent/40 hover:shadow-md">
      <Link href={`/candidats/${card.candidateId}`} className="mb-2 flex items-center gap-2 rounded-md p-1 -m-1 hover:bg-surface">
        <Avatar name={card.name} className="size-7 text-xs" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">{card.name}</p>
          {subtitle ? (
            <p className="truncate text-xs text-fg-muted">{subtitle}</p>
          ) : null}
        </div>
      </Link>
      <div className="space-y-1.5">
        {card.rows.map((row) => (
          <KanbanMissionRow key={row.missionId} row={row} />
        ))}
      </div>
    </div>
  )
}
