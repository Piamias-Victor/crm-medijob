import type { CandidatsTab } from '@/view-models/candidats-tab'
import type { InboxItem } from '@/view-models/application-inbox'
import type { CvthequeFilterConfig } from '@/lib/filters/cvtheque-filter-config'
import type { CandidateListFilters } from '@/view-models/candidate-list-filters.schema'
import type { RawCandidate, RawStage } from '@/view-models/candidate-kanban.types'

export type CandidatsPageProps = {
  list: { rows: RawCandidate[]; stages: RawStage[] }
  inbox: InboxItem[]
  serverFilters: CandidateListFilters
  filterConfig: CvthequeFilterConfig
  initialTab?: CandidatsTab
}
