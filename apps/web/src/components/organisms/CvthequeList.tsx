'use client'

import { Users } from 'lucide-react'
import { EmptyState } from '@/components/atoms/EmptyState'
import { AnimatedEntityGrid } from '@/components/molecules/AnimatedEntityGrid'
import { CvthequeListCard } from '@/components/molecules/CvthequeListCard'
import { toListItems, type RawCandidate } from '@/view-models/candidate-kanban'

export function CvthequeList({ candidates }: { candidates: RawCandidate[] }) {
  const items = toListItems(candidates)

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
    <AnimatedEntityGrid
      items={items}
      getKey={(candidate) => candidate.id}
      renderItem={(candidate) => <CvthequeListCard candidate={candidate} />}
    />
  )
}
