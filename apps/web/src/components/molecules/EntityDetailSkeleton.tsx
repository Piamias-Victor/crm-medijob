import { EntityDetailPageSkeleton } from '@/components/molecules/skeletons/EntityDetailPageSkeleton'

const CANDIDATE_TABS = ['w-20', 'w-28', 'w-24']

export function EntityDetailSkeleton() {
  return <EntityDetailPageSkeleton tabWidths={CANDIDATE_TABS} chipCount={3} />
}
