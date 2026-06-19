import { Skeleton } from '@/components/atoms/Skeleton'

export function EntityListSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[88rem] flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="rounded-xl border border-border bg-white shadow-sm">
        <div className="space-y-0 divide-y divide-border">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-4">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="hidden h-4 w-32 sm:block" />
              <Skeleton className="ml-auto h-6 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
