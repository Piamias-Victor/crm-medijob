import { Skeleton } from '@/components/atoms/Skeleton'
import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'
import { DetailPageHeaderSkeleton } from '@/components/molecules/skeletons/DetailPageHeaderSkeleton'
import { PillTabsSkeleton } from '@/components/molecules/skeletons/PillTabsSkeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'
import { FormFieldsSkeleton } from '@/components/molecules/skeletons/FormFieldsSkeleton'

type Props = {
  tabWidths: string[]
  chipCount?: number
  showMeta?: boolean
  metaWide?: boolean
}

export function EntityDetailPageSkeleton({
  tabWidths,
  chipCount = 2,
  showMeta = false,
  metaWide = false,
}: Props) {
  return (
    <SkeletonPageShell label="Chargement de la fiche">
      <DetailPageHeaderSkeleton chipCount={chipCount} />
      {showMeta ? (
        <div className="flex flex-wrap items-center gap-2 px-1" aria-hidden>
          <Skeleton className="h-6 w-24 rounded-full" />
          {metaWide ? <Skeleton className="h-4 w-32" /> : null}
        </div>
      ) : null}
      <PillTabsSkeleton widths={tabWidths} />
      <SectionCardSkeleton bodyClassName="p-5 sm:p-6">
        <FormFieldsSkeleton />
      </SectionCardSkeleton>
    </SkeletonPageShell>
  )
}
