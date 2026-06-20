'use client'

import { Users } from 'lucide-react'
import { CvthequeListCard } from '@/components/molecules/CvthequeListCard'
import { EntityGridList } from '@/components/organisms/EntityGridList'
import type { CandidateListRow } from '@/view-models/candidate-list'

export function CvthequeList({ rows }: { rows: CandidateListRow[] }) {
  return (
    <EntityGridList
      items={rows}
      getKey={(row) => row.id}
      renderItem={(row) => <CvthequeListCard candidate={row} />}
      emptyIcon={Users}
      emptyTitle="Aucun candidat"
      emptyDescription="Les candidats ajoutés à la CVthèque apparaîtront ici."
    />
  )
}
