'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { ApplicationInbox } from '@/components/molecules/ApplicationInbox'
import { CvthequeSection } from '@/components/organisms/CvthequeSection'
import type { CandidatsTab } from '@/view-models/candidats-tab'
import type { InboxItem } from '@/view-models/application-inbox'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

type Props = {
  tab: CandidatsTab
  list: { rows: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
  serverFilters: CandidateListFilters
  filterConfig: CvthequeFilterConfig
  onCountChange: (n: number) => void
}

export function CandidatsTabPanel({
  tab,
  list,
  inbox,
  serverFilters,
  filterConfig,
  onCountChange,
}: Props) {
  if (tab === 'cvtheque') {
    return (
      <CvthequeSection
        initialList={list}
        serverFilters={serverFilters}
        filterConfig={filterConfig}
        onCountChange={onCountChange}
      />
    )
  }
  return (
    <SectionCard
      variant="glass"
      title="Candidatures reçues"
      description="Candidatures du site — ouvrez une fiche pour convertir, refuser ou lancer un entretien."
      bodyClassName="p-4 sm:p-5"
    >
      <ApplicationInbox items={inbox} />
    </SectionCard>
  )
}
