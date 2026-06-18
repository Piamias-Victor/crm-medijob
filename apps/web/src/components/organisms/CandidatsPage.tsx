'use client'

import { useState } from 'react'
import { CandidatTabs, type CandidatsTab } from '@/components/molecules/CandidatTabs'
import { ApplicationInbox } from '@/components/molecules/ApplicationInbox'
import { CvthequeSection } from '@/components/organisms/CvthequeSection'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban'
import type { InboxItem } from '@/view-models/application-inbox'

type Props = {
  cvtheque: { candidates: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
}

export function CandidatsPage({ cvtheque, inbox }: Props) {
  const [tab, setTab] = useState<CandidatsTab>('cvtheque')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-fg">Candidats</h1>
      <CandidatTabs active={tab} onChange={setTab} inboxCount={inbox.length} />
      {tab === 'cvtheque' ? (
        <CvthequeSection candidates={cvtheque.candidates} stages={cvtheque.stages} />
      ) : (
        <ApplicationInbox items={inbox} />
      )}
    </div>
  )
}
