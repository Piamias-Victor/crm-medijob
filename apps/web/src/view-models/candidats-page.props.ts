import type { CandidatsTab } from '@/view-models/candidats-tab'
import type { InboxItem } from '@/view-models/application-inbox'
import type { AppProfileListItem } from '@/view-models/app-profile-list'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'
import type { RefItem } from '@/view-models/referential'

export type CandidatsPageProps = {
  list: { rows: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
  appProfiles: AppProfileListItem[]
  jobTitles: RefItem[]
  serverFilters: CandidateListFilters
  filterConfig: CvthequeFilterConfig
  initialTab?: CandidatsTab
}
