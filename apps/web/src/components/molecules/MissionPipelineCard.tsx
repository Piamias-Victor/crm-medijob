'use client'

import { type DragEvent } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { GripVertical, X } from 'lucide-react'
import { Avatar } from '@/components/atoms/Avatar'
import { DND_MIME } from '@/components/molecules/kanban-dnd'
import { cardHover } from '@/lib/motion/variants'
import type { PipelineCandidateRow } from '@/view-models/mission-pipeline.types'

type Props = {
  missionId: string
  card: PipelineCandidateRow
  busy: boolean
  onRemove: (candidateId: string) => void
}

function subtitle(card: PipelineCandidateRow) {
  return [card.jobTitle, [card.postalCode, card.city].filter(Boolean).join(' ')].filter(Boolean).join(' · ')
}

export function MissionPipelineCard({ missionId, card, busy, onRemove }: Props) {
  function handleDragStart(event: DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData(
      DND_MIME,
      JSON.stringify({
        missionId,
        candidateId: card.candidateId,
        fromStageId: card.stageId,
      }),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  const meta = subtitle(card)

  return (
    <motion.div {...cardHover} className="rounded-xl">
      <article
        draggable
        onDragStart={handleDragStart}
        className="relative cursor-grab rounded-xl border border-border/55 bg-white/95 p-2.5 pr-8 shadow-sm active:cursor-grabbing"
      >
        <button
          type="button"
          aria-label={`Retirer ${card.fullName} de la mission`}
          disabled={busy}
          onClick={() => onRemove(card.candidateId)}
          className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full text-fg-muted transition-colors hover:bg-error/10 hover:text-error"
        >
          <X className="size-3.5" />
        </button>
        <div className="flex items-center gap-2">
          <GripVertical aria-hidden className="size-4 shrink-0 text-fg-muted/70" />
          <Link
            href={`/candidats/${card.candidateId}`}
            className="flex min-w-0 flex-1 items-center gap-2"
          >
            <Avatar name={card.fullName} className="size-8 text-[11px]" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight text-fg">{card.fullName}</p>
              {meta ? <p className="truncate text-[11px] leading-tight text-fg-muted">{meta}</p> : null}
            </div>
          </Link>
        </div>
      </article>
    </motion.div>
  )
}
