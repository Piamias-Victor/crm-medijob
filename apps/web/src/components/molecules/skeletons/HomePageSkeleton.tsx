import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'
import { PageHeaderSkeleton } from '@/components/molecules/skeletons/PageHeaderSkeleton'
import { PillTabsSkeleton } from '@/components/molecules/skeletons/PillTabsSkeleton'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'
import { Skeleton } from '@/components/atoms/Skeleton'

const NAV_WIDTHS = ['w-24', 'w-28', 'w-28', 'w-32']

export function HomePageSkeleton() {
  return (
    <SkeletonPageShell label="Chargement de l'accueil" maxWidth="max-w-6xl">
      <PageHeaderSkeleton nav={<PillTabsSkeleton widths={NAV_WIDTHS} />} />
      <SectionCardSkeleton bodyClassName="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[4.5rem] rounded-lg" />
          ))}
        </div>
      </SectionCardSkeleton>
      <SectionCardSkeleton bodyClassName="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[4.5rem] rounded-lg" />
          ))}
        </div>
      </SectionCardSkeleton>
    </SkeletonPageShell>
  )
}
