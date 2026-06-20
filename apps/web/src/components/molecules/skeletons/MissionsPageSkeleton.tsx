import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'
import { PageHeaderSkeleton } from '@/components/molecules/skeletons/PageHeaderSkeleton'
import { PillTabsSkeleton } from '@/components/molecules/skeletons/PillTabsSkeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'
import { EntityGridSkeleton } from '@/components/molecules/skeletons/EntityGridSkeleton'

export function MissionsPageSkeleton() {
  return (
    <SkeletonPageShell label="Chargement des missions">
      <PageHeaderSkeleton />
      <SectionCardSkeleton action="toggle" bodyClassName="p-4 sm:p-5">
        <EntityGridSkeleton />
      </SectionCardSkeleton>
    </SkeletonPageShell>
  )
}
