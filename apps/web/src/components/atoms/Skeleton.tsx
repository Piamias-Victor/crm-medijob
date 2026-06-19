import { cn } from '@/lib/cn'

type Props = {
  className?: string
  variant?: 'line' | 'circle' | 'block'
}

const VARIANTS = {
  line: 'h-3 w-full rounded',
  circle: 'size-11 rounded-full',
  block: 'h-24 w-full rounded-lg',
} as const

export function Skeleton({ className, variant = 'line' }: Props) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse bg-surface', VARIANTS[variant], className)}
    />
  )
}
