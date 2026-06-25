import { CvthequeFilterBarSkeleton } from '@/components/molecules/skeletons/CvthequeFilterBarSkeleton'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'

export function CvthequeTableSkeleton() {
  return (
    <div className="space-y-4">
      <CvthequeFilterBarSkeleton />
      <EntityTableSkeleton columns={7} />
    </div>
  )
}
