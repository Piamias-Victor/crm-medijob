import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'
import { PageHeaderSkeleton } from '@/components/molecules/skeletons/PageHeaderSkeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'
import { EntityTableSkeleton } from '@/components/molecules/skeletons/EntityTableSkeleton'

export function EntityListPageSkeleton() {
  return (
    <SkeletonPageShell label="Chargement de la liste">
      <PageHeaderSkeleton />
      <SectionCardSkeleton action="button" bodyClassName="p-4 sm:p-5">
        <EntityTableSkeleton />
      </SectionCardSkeleton>
    </SkeletonPageShell>
  )
}
