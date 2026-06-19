'use client'

import Link from 'next/link'
import { type DragEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { Briefcase, Building2, GripVertical, UserRound } from 'lucide-react'
import { cn } from '@/lib/cn'
import { DND_MIME } from '@/components/molecules/kanban-dnd'
import { cardHover } from '@/lib/motion/variants'
import type { MissionKanbanCard } from '@/view-models/mission-kanban'

const shellClass =
  'cursor-grab rounded-xl border border-border/55 bg-white/92 p-3 shadow-sm transition-[border-color,box-shadow] duration-200 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 active:cursor-grabbing'

export function MissionKanbanCardView({ card }: { card: MissionKanbanCard }) {
  const [dragging, setDragging] = useState(false)
  const subtitle = [card.jobTitle, card.city].filter(Boolean).join(' · ')

  function handleDragStart(event: DragEvent<HTMLElement>) {
    event.dataTransfer.setData(
      DND_MIME,
      JSON.stringify({ missionId: card.missionId, fromStatus: card.fromStatus }),
    )
    event.dataTransfer.effectAllowed = 'move'
    setDragging(true)
  }

  return (
    <motion.div {...cardHover}>
      <article
        draggable
        onDragStart={handleDragStart}
        onDragEnd={() => setDragging(false)}
        className={cn(shellClass, dragging && 'opacity-60 shadow-none')}
      >
        <div className="mb-2 flex items-center gap-2">
          <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary-muted text-primary">
            <Briefcase className="size-3.5" aria-hidden />
          </span>
          <div className="min-w-0 flex-1">
            <Link href={`/missions/${card.missionId}`} className="block min-w-0 hover:text-accent-hover">
              <p className="truncate text-sm font-semibold text-fg">{card.title}</p>
              {subtitle ? <p className="truncate text-xs text-fg-muted">{subtitle}</p> : null}
            </Link>
          </div>
        </div>
        <div className="flex gap-2 rounded-md border border-border bg-surface px-2 py-1.5">
          <GripVertical aria-hidden className="mt-0.5 size-4 shrink-0 text-fg-muted" />
          <div className="min-w-0 flex-1 space-y-1">
            <p className="flex items-center gap-1 truncate text-xs text-fg">
              <Building2 aria-hidden className="size-3 shrink-0 text-fg-muted" />
              {card.pharmacyName}
            </p>
            {card.referent ? (
              <p className="flex items-center gap-1 truncate text-xs text-fg-muted">
                <UserRound aria-hidden className="size-3 shrink-0" />
                {card.referent}
              </p>
            ) : null}
          </div>
        </div>
      </article>
    </motion.div>
  )
}
