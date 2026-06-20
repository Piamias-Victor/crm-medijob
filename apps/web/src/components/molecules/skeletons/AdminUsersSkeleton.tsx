import { Skeleton } from '@/components/atoms/Skeleton'
import { LIST_CARD_SHELL_CLASS } from '@/lib/constants/list-card'
import { SectionCardSkeleton } from '@/components/molecules/skeletons/SectionCardSkeleton'

function UserCardSkeleton() {
  return (
    <article className={LIST_CARD_SHELL_CLASS} aria-hidden>
      <div className="flex items-start gap-3">
        <Skeleton variant="block" className="size-9 shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-40" />
        </div>
        <Skeleton className="h-5 w-16 shrink-0 rounded-full" />
      </div>
      <Skeleton className="h-4 w-28 rounded-full" />
      <div className="flex justify-end gap-1 border-t border-border/40 pt-2">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="size-8 rounded-lg" />
      </div>
    </article>
  )
}

export function AdminUsersSkeleton() {
  return (
    <SectionCardSkeleton action="button" bodyClassName="p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2" aria-hidden>
        {Array.from({ length: 4 }, (_, index) => (
          <UserCardSkeleton key={index} />
        ))}
      </div>
    </SectionCardSkeleton>
  )
}
