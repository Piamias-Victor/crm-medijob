'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { CvthequeListCard } from '@/components/molecules/CvthequeListCard'
import { shouldAnimateList } from '@/lib/motion/list-motion'
import { toListItems, type RawCandidate } from '@/view-models/candidate-kanban'

const cardMotion = {
  initial: { opacity: 0, y: 10, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1 },
}

export function CvthequeList({ candidates }: { candidates: RawCandidate[] }) {
  const items = toListItems(candidates)
  const animateCards = shouldAnimateList(items.length)

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aucun candidat"
        description="Les candidats ajoutés à la CVthèque apparaîtront ici."
      />
    )
  }

  return (
    <div className="grid auto-rows-fr gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((candidate, index) => {
        if (!animateCards) return <CvthequeListCard key={candidate.id} candidate={candidate} />

        return (
          <motion.div
            key={candidate.id}
            className="h-full"
            {...cardMotion}
            transition={{ duration: 0.22, delay: index * 0.03 }}
          >
            <CvthequeListCard candidate={candidate} />
          </motion.div>
        )
      })}
    </div>
  )
}
