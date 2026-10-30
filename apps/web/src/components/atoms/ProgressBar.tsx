import { cn } from '@/lib/cn'

type Props = {
  value: number
  label?: string
  indeterminate?: boolean
  className?: string
}

export function ProgressBar({ value, label, indeterminate = false, className }: Props) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {label && <p className="text-sm text-fg-muted">{label}</p>}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-border/60"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(pct)}
        aria-label={label ?? 'Progression'}
      >
        <div
          className={cn(
            'h-full rounded-full bg-accent transition-[width] duration-200',
            indeterminate && 'w-1/3 animate-pulse',
          )}
          style={indeterminate ? undefined : { width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
