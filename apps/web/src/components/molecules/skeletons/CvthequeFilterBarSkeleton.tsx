import { Skeleton } from '@/components/atoms/Skeleton'
import { cn } from '@/lib/cn'

const FILTER_WIDTHS = ['w-28', 'w-24', 'w-24', 'w-32'] as const

export function CvthequeFilterBarSkeleton() {
  return (
    <div
      className="flex flex-wrap items-end gap-2 rounded-lg border border-border bg-surface px-3 py-2"
      aria-hidden
    >
      {FILTER_WIDTHS.map((width, index) => (
        <div key={index} className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className={cn('h-9 rounded-md', width)} />
        </div>
      ))}
      <Skeleton className="h-9 w-28 rounded-md" />
      <Skeleton className="h-9 w-24 rounded-md" />
      <Skeleton className="ml-auto h-9 w-32 rounded-md" />
    </div>
  )
}
