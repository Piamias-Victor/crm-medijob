import { EntityDetailPageSkeleton } from '@/components/molecules/skeletons/EntityDetailPageSkeleton'

const TABS = ['w-20', 'w-28', 'w-24']

export default function Loading() {
  return <EntityDetailPageSkeleton tabWidths={TABS} chipCount={3} />
}
