import { Skeleton } from '@/components/atoms/Skeleton'
import { LIST_CARD_SHELL_CLASS } from '@/lib/constants/list-card'

export function ListCardSkeleton() {
  return (
    <article className={LIST_CARD_SHELL_CLASS} aria-hidden>
      <div className="flex items-start gap-3">
        <Skeleton variant="block" className="size-9 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-5 w-32 rounded-full" />
      </div>
    </article>
  )
}
