import { Skeleton } from '@/components/atoms/Skeleton'

type Props = {
  count?: number
  withGrip?: boolean
}

export function InlineRowsSkeleton({ count = 5, withGrip = false }: Props) {
  return (
    <ul className="flex flex-col gap-2" aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li
          key={index}
          className="flex items-center gap-2 rounded-lg border border-border/50 bg-white/90 px-3 py-2.5 shadow-sm"
        >
          {withGrip ? <Skeleton className="size-4 shrink-0 rounded" /> : null}
          <Skeleton className="h-4 flex-1 max-w-xs" />
          <div className="ml-auto flex gap-1">
            <Skeleton className="size-8 rounded-lg" />
            <Skeleton className="size-8 rounded-lg" />
          </div>
        </li>
      ))}
    </ul>
  )
}
