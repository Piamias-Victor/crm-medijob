'use client'

import { motion } from 'framer-motion'
import { UserX } from 'lucide-react'
import { MissionMatchingExcludedCard } from '@/components/molecules/MissionMatchingExcludedCard'
import { listContainer } from '@/lib/motion/variants'
import type { MissionMatchingExcludedRow } from '@/view-models/mission-matching'

type Props = { excluded: MissionMatchingExcludedRow[] }

export function MissionMatchingExcludedSection({ excluded }: Props) {
  if (excluded.length === 0) return null

  return (
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
  )
}
