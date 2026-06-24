import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'
import { PageHeaderSkeleton } from '@/components/molecules/skeletons/PageHeaderSkeleton'
import { PillTabsSkeleton } from '@/components/molecules/skeletons/PillTabsSkeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'
import { CvthequeTableSkeleton } from '@/components/molecules/skeletons/CvthequeTableSkeleton'

const TAB_WIDTHS = ['w-28', 'w-44']

export function CandidatsPageSkeleton() {
  return (
    <SkeletonPageShell label="Chargement des candidats">
      <PageHeaderSkeleton nav={<PillTabsSkeleton widths={TAB_WIDTHS} />} />
      <SectionCardSkeleton action="toggle" bodyClassName="p-4 sm:p-5">
        <CvthequeTableSkeleton />
      </SectionCardSkeleton>
    </SkeletonPageShell>
  )
}
