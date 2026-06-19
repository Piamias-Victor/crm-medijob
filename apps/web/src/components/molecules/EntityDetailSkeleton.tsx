import { Skeleton } from '@/components/atoms/Skeleton'

export function EntityDetailSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-9 w-24 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-32 rounded-full" />
      </div>
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <Skeleton className="mb-4 h-6 w-48" />
        <div className="space-y-3">
          <Skeleton variant="block" className="h-12" />
          <Skeleton variant="block" className="h-12" />
          <Skeleton variant="block" className="h-32" />
        </div>
      </div>
    </div>
  )
}
