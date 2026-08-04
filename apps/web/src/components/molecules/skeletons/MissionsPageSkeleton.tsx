import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'
import { PageHeaderSkeleton } from '@/components/molecules/skeletons/PageHeaderSkeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'

export function MissionsPageSkeleton() {
  return (
    <SkeletonPageShell label="Chargement des missions">
      <PageHeaderSkeleton />
      <SectionCardSkeleton action="toggle" bodyClassName="p-4 sm:p-5">
        <EntityTableSkeleton />
      </SectionCardSkeleton>
    </SkeletonPageShell>
  )
}
