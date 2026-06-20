import { EntityDetailPageSkeleton } from '@/components/molecules/skeletons/EntityDetailPageSkeleton'

const TABS = ['w-20', 'w-24', 'w-36', 'w-28', 'w-28']

export default function Loading() {
  return <EntityDetailPageSkeleton tabWidths={TABS} chipCount={2} showMeta metaWide />
}
