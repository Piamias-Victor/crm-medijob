export function SkeletonShowcase() {
  return (
    <div className="w-80 space-y-3 rounded-lg border border-border bg-white p-4">
      <div className="flex items-center gap-3">
        <div className="size-11 animate-pulse rounded-full bg-surface" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-2/3 animate-pulse rounded bg-surface" />
          <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
        </div>
      </div>
      <div className="h-3 w-full animate-pulse rounded bg-surface" />
      <div className="h-3 w-5/6 animate-pulse rounded bg-surface" />
    </div>
  )
}
