'use client'

import { useState } from 'react'
import { ViewToggle, type CvView } from '@/components/molecules/ViewToggle'
import { CvthequeList } from '@/components/organisms/CvthequeList'
import { CvthequeKanban } from '@/components/organisms/CvthequeKanban'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban'

type Props = { candidates: RawCandidate[]; stages: RawStage[] }

export function CvthequeSection({ candidates, stages }: Props) {
  const [view, setView] = useState<CvView>('list')

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ViewToggle view={view} onChange={setView} />
      </div>
      {view === 'list' ? (
        <CvthequeList candidates={candidates} />
      ) : (
        <CvthequeKanban candidates={candidates} stages={stages} />
      )}
    </div>
  )
}
