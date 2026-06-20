import { Skeleton } from '@/components/atoms/Skeleton'
import { SkeletonPageShell } from '@/components/molecules/skeletons/SkeletonPageShell'

export function PagePlaceholderSkeleton() {
  return (
    <SkeletonPageShell maxWidth="max-w-2xl" label="Chargement de la page">
      <Skeleton className="mb-4 h-8 w-32" />
      <div
        className="flex flex-col items-center gap-4 rounded-xl border border-border bg-white p-8 text-center shadow-sm"
        aria-hidden
      >
        <Skeleton variant="block" className="size-12 rounded-xl" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
    </SkeletonPageShell>
  )
}
