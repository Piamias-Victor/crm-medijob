'use client'

import { SectionCard } from '@/components/molecules/SectionCard'
import { ApplicationInbox } from '@/components/molecules/ApplicationInbox'
import { AppProfilesSection } from '@/components/organisms/AppProfilesSection'
import { CvthequeSection } from '@/components/organisms/CvthequeSection'
import type { CandidatsTab } from '@/view-models/candidats-tab'
import type { InboxItem } from '@/view-models/application-inbox'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import type { RefItem } from '@/view-models/referential'

type Props = {
  tab: CandidatsTab
  list: { rows: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
  appProfiles: AppProfileListItem[]
  jobTitles: RefItem[]
  serverFilters: CandidateListFilters
  filterConfig: CvthequeFilterConfig
  onCountChange: (n: number) => void
}

export function CandidatsTabPanel({
  tab,
  list,
  inbox,
  appProfiles,
  jobTitles,
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
  if (tab === 'app-profiles') {
    return <AppProfilesSection initialItems={appProfiles} jobTitles={jobTitles} />
  }
  return (
    <SectionCard
      variant="glass"
      title="Candidatures reçues"
      description="Flux entrant Webflow — validez ou refusez avant intégration à la CVthèque."
      bodyClassName="p-4 sm:p-5"
    >
      <ApplicationInbox items={inbox} />
    </SectionCard>
  )
}
