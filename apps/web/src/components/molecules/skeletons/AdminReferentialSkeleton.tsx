import { Skeleton } from '@/components/atoms/Skeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'
import { InlineRowsSkeleton } from '@/components/molecules/skeletons/InlineRowsSkeleton'

function AddFormSkeleton() {
  return (
    <div className="flex gap-2" aria-hidden>
      <Skeleton className="h-10 flex-1 rounded-lg" />
      <Skeleton className="h-10 w-24 rounded-lg" />
    </div>
  )
}

export function AdminReferentialSkeleton() {
  return (
    <SectionCardSkeleton bodyClassName="space-y-4 p-4 sm:p-5">
      <AddFormSkeleton />
      <InlineRowsSkeleton />
    </SectionCardSkeleton>
  )
}
