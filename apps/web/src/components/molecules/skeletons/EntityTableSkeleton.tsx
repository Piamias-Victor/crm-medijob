import { Skeleton } from '@/components/atoms/Skeleton'
import { cn } from '@/lib/cn'

type Props = {
  columns?: number
  rows?: number
  hasActions?: boolean
}

export function EntityTableSkeleton({ columns = 7, rows = 8, hasActions = true }: Props) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface/80" aria-hidden>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-sm">
          <thead className="border-b border-border/80 bg-gradient-to-r from-primary-muted/80 via-primary-muted/50 to-accent-muted/70">
            <tr>
              {Array.from({ length: columns }, (_, index) => (
                <th key={index} className="px-3 py-2">
                  <Skeleton className="h-3 w-16" />
                </th>
              ))}
              {hasActions ? (
                <th className="px-3 py-2">
                  <Skeleton className="ml-auto h-3 w-12" />
                </th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }, (_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/50 last:border-b-0">
                {Array.from({ length: columns }, (_, colIndex) => (
                  <td key={colIndex} className="px-3 py-3">
                    <Skeleton className={cn('h-4', colIndex < 2 ? 'w-24' : 'w-20')} />
                  </td>
                ))}
                {hasActions ? (
                  <td className="px-3 py-3">
                    <Skeleton className="ml-auto size-8 rounded-lg" />
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border/80 px-3 py-2">
        <Skeleton className="h-4 w-36" />
        <div className="flex gap-2">
          <Skeleton className="size-8 rounded-lg" />
          <Skeleton className="size-8 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
