'use client'

import { useState } from 'react'
import { ListKanbanShell } from '@/components/molecules/ListKanbanShell'
import { CvthequeList } from '@/components/organisms/CvthequeList'
import { CvthequeKanban } from '@/components/organisms/CvthequeKanban'
import type { CvView } from '@/components/molecules/ViewToggle'
import type { CandidateListRow } from '@/view-models/candidate-list'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

type Props = { rows: CandidateListRow[]; candidates: RawCandidate[]; stages: RawStage[] }

export function CvthequeSection({ rows, candidates, stages }: Props) {
  const [view, setView] = useState<CvView>('list')

  return (
    <ListKanbanShell
      view={view}
      onViewChange={setView}
      listTitle="CVthèque"
      kanbanTitle="CVthèque"
      listDescription="Parcourez tous les profils de la CVthèque."
      kanbanDescription="Suivez la progression par mission et étape de pipeline."
      listView={<CvthequeList rows={rows} />}
      kanbanView={<CvthequeKanban candidates={candidates} stages={stages} />}
    />
  )
}
